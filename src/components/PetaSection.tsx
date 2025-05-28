"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L, {
  LatLngBoundsExpression,
  LatLngTuple,
  Map as LeafletMap,
  LatLngBounds,
} from "leaflet";
import { motion } from "framer-motion";

// Fix ikon Leaflet untuk Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Interface KmlPoint
interface KmlPoint {
  id: string;
  name: string;
  description: string;
  latlng: LatLngTuple;
}

// Lebar popup yang seragam
const POPUP_WIDTH = 300;

// Fungsi createCustomKmlPopupHtml
function createCustomKmlPopupHtml(name: string, description: string): string {
  let processedDescription = description;
  const cdataMatch = description.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  if (cdataMatch && cdataMatch[1]) {
    processedDescription = cdataMatch[1];
  }
  processedDescription = processedDescription
    .replace(/<font[^>]*>/g, "")
    .replace(/<\/font>/g, "");

  const links: { placeholder: string; html: string }[] = [];
  let tempDescription = processedDescription.replace(
    /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
    (match, href, textContent) => {
      const placeholder = `__LINK_PLACEHOLDER_${links.length}__`;
      const linkText = textContent.trim() || href;
      links.push({
        placeholder,
        html: `<p><a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${linkText}</a></p>`,
      });
      return placeholder;
    }
  );

  const lines = tempDescription.split(/\n|<br\s*\/?>/i);
  let formattedContent = "";
  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;
    if (trimmedLine.startsWith("__LINK_PLACEHOLDER_")) {
      formattedContent += trimmedLine + "\n";
      return;
    }
    const parts = trimmedLine.split(/:(.*)/s);
    if (parts.length > 1 && parts[0].trim() !== "") {
      const label = parts[0].trim();
      let value = parts[1].trim();
      formattedContent += `<p><strong>${label}:</strong> ${value}</p>\n`;
    } else {
      formattedContent += `<p>${trimmedLine}</p>\n`;
    }
  });

  links.forEach((linkInfo) => {
    const placeholderWithNewline = linkInfo.placeholder + "\n";
    if (formattedContent.includes(placeholderWithNewline)) {
      formattedContent = formattedContent.replace(
        placeholderWithNewline,
        linkInfo.html
      );
    } else {
      formattedContent = formattedContent.replace(
        linkInfo.placeholder,
        linkInfo.html
      );
    }
  });

  return `
    <div class="jejaksatwa-kml-popup">
      <h3 class="jejaksatwa-kml-popup-title">${name}</h3>
      <div class="jejaksatwa-kml-popup-description">
        ${formattedContent.trim()}
      </div>
    </div>
  `;
}

// Fungsi WilayahGeoJsonLayer
function WilayahGeoJsonLayer() {
  const map = useMap();
  useEffect(() => {
    fetch("/data/kecamatan_aceh_colored.geojson")
      .then((res) => res.json())
      .then((data) => {
        L.geoJSON(data, {
          style: (feature: any) => ({
            color: feature.properties.stroke || "#555",
            weight: feature.properties["stroke-width"] || 1.5,
            fillColor: feature.properties.fill || "#999",
            fillOpacity: feature.properties["fill-opacity"] || 0.6,
          }),
          onEachFeature: (feature, layer) => {
            const name =
              feature.properties.name ||
              feature.properties.NAMOBJ ||
              "Wilayah Tidak Diketahui";
            layer.bindPopup(
              `<div class="jejaksatwa-geojson-popup">
                <h4 class="jejaksatwa-geojson-popup-title">Wilayah: ${name}</h4>
              </div>`,
              {
                className: "jejaksatwa-geojson-custom-popup",
                minWidth: POPUP_WIDTH,
                maxWidth: POPUP_WIDTH,
              }
            );
          },
        }).addTo(map);
      });
  }, [map]);
  return null;
}

// Props untuk TitikSatwaKmlLayer
interface TitikSatwaKmlLayerProps {
  onLoad: (points: KmlPoint[]) => void;
  onMarkersReady: (markers: Record<string, L.Marker>) => void;
  onKmlLoadSuccess: (bounds: LatLngBounds) => void;
}

function TitikSatwaKmlLayer({
  onLoad,
  onMarkersReady,
  onKmlLoadSuccess,
}: TitikSatwaKmlLayerProps) {
  const map = useMap();

  useEffect(() => {
    const loadKmlData = async () => {
      const omnivore = (await import("@mapbox/leaflet-omnivore")).default;
      const localKmlMarkers: Record<string, L.Marker> = {};
      let pointIdCounter = 0;

      omnivore
        .kml("/data/TITIK KOORDINAT SATWA.kml")
        .on("ready", function (this: any) {
          const extractedPoints: KmlPoint[] = [];
          this.eachLayer((layer: any) => {
            if (
              !(layer instanceof L.Marker) ||
              typeof layer.getLatLng !== "function"
            ) {
              return;
            }
            if (layer.setIcon) layer.setIcon(new L.Icon.Default());

            const name =
              layer.feature?.properties?.name || "Titik Tidak Bernama";
            const description =
              layer.feature?.properties?.description || "Tidak ada deskripsi.";

            const coords = layer.getLatLng();
            const latlng: LatLngTuple = [coords.lat, coords.lng];
            const pointId = `kml-point-${name.replace(
              /\s+/g,
              "-"
            )}-${pointIdCounter++}`;

            layer.bindPopup(createCustomKmlPopupHtml(name, description), {
              className: "jejaksatwa-kml-custom-popup",
              minWidth: POPUP_WIDTH,
              maxWidth: POPUP_WIDTH,
            });

            extractedPoints.push({ id: pointId, name, description, latlng });
            localKmlMarkers[pointId] = layer as L.Marker;
          });

          onLoad(extractedPoints);
          onMarkersReady(localKmlMarkers);

          this.addTo(map);
          if (this.getBounds?.().isValid()) {
            const kmlBounds = this.getBounds();
            onKmlLoadSuccess(kmlBounds);
            map.fitBounds(kmlBounds, { padding: [50, 50] });
          }
        });
    };
    loadKmlData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, onLoad, onMarkersReady, onKmlLoadSuccess]);
  return null;
}

// Komponen Tombol Kontrol FitBounds
interface FitBoundsControlProps {
  boundsToFit: LatLngBounds | null;
  defaultBounds: LatLngBoundsExpression;
  title?: string;
}

function FitBoundsControl({
  boundsToFit,
  defaultBounds,
  title = "Lihat Semua Titik",
}: FitBoundsControlProps) {
  const map = useMap();

  const handleFitBounds = () => {
    if (boundsToFit && boundsToFit.isValid()) {
      map.flyToBounds(boundsToFit, { padding: [50, 50], duration: 0.7 });
    } else {
      map.flyToBounds(defaultBounds, { padding: [50, 50], duration: 0.7 });
    }
  };

  const controlButtonStyles: React.CSSProperties = {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 1000,
    backgroundColor: "white",
    padding: "8px", // Sedikit padding agar ikon tidak terlalu mepet
    border: "2px solid rgba(0,0,0,0.2)",
    borderRadius: "4px",
    cursor: "pointer",
    boxShadow: "0 1px 5px rgba(0,0,0,0.65)",
    lineHeight: "1", // Untuk memastikan ikon vertikal tengah jika ada teks
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <button onClick={handleFitBounds} style={controlButtonStyles} title={title}>
      {/* Ikon SVG Baru (Terinspirasi dari Gambar Anda) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
        <path d="M12.518 6.973c-1.793-.02-3.505.838-4.562 2.368-.306.443-.189 1.045.253 1.351.443.306 1.045.189 1.351-.253.614-.886 1.594-1.466 2.674-1.466 1.304 0 2.458.835 2.875 2.027.12.339.455.543.794.543.087 0 .175-.013.26-.04.487-.152.752-.674.6-1.161C15.981 8.618 14.387 7 12.518 6.973z" />
        <path d="M9.012 12.212c-.487.002-.914.338-1.017.815-.131.608.313 1.182.92 1.312.092.02.184.03.276.03.508 0 .945-.374 1.005-.885.097-.834-.08-1.69-.483-2.387-.212-.368-.67-.507-1.039-.296-.37.212-.509.67-.298 1.039.238.413.341.876.29 1.345-.02.18-.172.315-.356.315z" />
        <path d="M14.753 11.383c-.438-.31-.98-.17-1.289.268-.606.856-1.611 1.349-2.711 1.349-1.1 0-2.104-.493-2.711-1.349-.31-.438-.851-.578-1.289-.268-.432.304-.576.845-.268 1.283.933 1.316 2.508 2.134 4.268 2.134s3.334-.818 4.268-2.134c.308-.438.164-.979-.268-1.283z" />
      </svg>
    </button>
  );
}

// Komponen Utama Peta
export default function PetaSectionInteraktif() {
  const [kmlPoints, setKmlPoints] = useState<KmlPoint[]>([]);
  const mapRef = useRef<LeafletMap | null>(null);
  const [kmlMarkers, setKmlMarkers] = useState<Record<string, L.Marker>>({});
  const [kmlDataBounds, setKmlDataBounds] = useState<LatLngBounds | null>(null);

  const acehCenter: LatLngTuple = [4.695135, 96.749399];
  const initialMapBounds: LatLngBoundsExpression = [
    [2.0, 94.8],
    [6.1, 98.6],
  ];

  const handleSidebarItemClick = (pointId: string) => {
    if (!mapRef.current || !kmlMarkers[pointId]) {
      console.warn(
        "Referensi peta atau marker tidak ditemukan untuk ID:",
        pointId
      );
      return;
    }
    const currentMap = mapRef.current;
    const marker = kmlMarkers[pointId];
    const pointLatLng = marker.getLatLng();
    const targetZoom = currentMap.getZoom() < 12 ? 13 : currentMap.getZoom();
    currentMap.flyTo(pointLatLng, targetZoom, { animate: true, duration: 0.7 });
    setTimeout(() => {
      marker.openPopup();
    }, 750);
  };

  return (
    <section
      id="peta-interaktif"
      className="relative min-h-screen bg-gray-50 py-16 md:py-24 scroll-mt-20 border-t"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-green-700 mb-4">
            Peta Interaktif Jejak Satwa di Aceh
          </h2>
          <p className="text-md lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Jelajahi sebaran wilayah dan temukan titik-titik penting terkait
            observasi satwa langka yang dilindungi di Provinsi Aceh.
          </p>
        </motion.div>
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-stretch">
          {/* Sidebar */}
          <div className="w-full lg:w-1/3 h-auto lg:h-[550px]">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg h-full flex flex-col p-5 md:p-6">
              <h3 className="text-xl md:text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2.5 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-7 h-7 text-green-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                Daftar Titik Kasus Satwa
              </h3>
              <div className="space-y-3 overflow-y-auto pr-2 flex-1 custom-scrollbar">
                {kmlPoints.length > 0 ? (
                  kmlPoints.map((point, index) => (
                    <div
                      key={point.id}
                      className="p-3.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-white hover:shadow-md hover:border-green-300 transition-all duration-200 cursor-pointer"
                      onClick={() => handleSidebarItemClick(point.id)}
                    >
                      <h4 className="font-semibold text-sm text-gray-800 mb-1">
                        {index + 1}. {point.name}
                      </h4>
                      <p className="text-xs text-gray-600 leading-snug line-clamp-3">
                        {point.description
                          .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, "$1")
                          .replace(/<[^>]+>/g, " ")
                          .substring(0, 150) + "..."}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-sm italic">
                      Memuat data titik observasi...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Peta */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-2/3 h-[450px] md:h-[500px] lg:h-[550px]"
          >
            <div className="relative rounded-xl shadow-2xl overflow-hidden border-2 border-green-300 h-full">
              <MapContainer
                ref={mapRef}
                center={acehCenter}
                zoom={8}
                className="w-full h-full"
                scrollWheelZoom={true}
                bounds={initialMapBounds}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <WilayahGeoJsonLayer />
                <TitikSatwaKmlLayer
                  onLoad={setKmlPoints}
                  onMarkersReady={setKmlMarkers}
                  onKmlLoadSuccess={setKmlDataBounds}
                />
                <FitBoundsControl
                  boundsToFit={kmlDataBounds}
                  defaultBounds={initialMapBounds}
                />
              </MapContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
