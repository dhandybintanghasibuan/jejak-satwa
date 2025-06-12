"use client";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { useEffect, useState, useRef, CSSProperties, Fragment } from "react";
import "leaflet/dist/leaflet.css";
import L, {
  LatLngBoundsExpression,
  LatLngTuple,
  LatLngBounds,
  Marker as LeafletMarkerType,
  PathOptions,
} from "leaflet";
import { motion } from "framer-motion";
import { Feature, GeoJsonObject } from "geojson";

// --- KONSTANTA ---
const TILE_LAYER_URL =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png";
const TILE_LAYER_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
const GEOJSON_WILAYAH_PATH = "/data/kabupaten_aceh_new.geojson";
const KML_SATWA_PATH = "/data/titik_koordinat_satwa.kml";
const DEFAULT_POPUP_WIDTH = 350;
const MAP_FLY_TO_DURATION = 0.7;

// Perbaikan ikon Leaflet untuk Next.js
if (typeof window !== "undefined") {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

// --- Tipe Data ---
interface KmlPoint {
  id: string;
  name: string;
  description: string;
  latlng: LatLngTuple;
}

interface OmnivoreLayer extends L.LayerGroup {
  getBounds: () => LatLngBounds;
}

// --- Komponen-komponen ---

function PopupContent({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  const cleanDescription = description.replace(
    /<!\[CDATA\[([\s\S]*?)\]\]>/,
    "$1"
  );
  const lines = cleanDescription
    .split("\n")
    .filter((line) => line.trim() !== "");

  const renderValue = (value: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = value.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Lihat Sumber
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="jejaksatwa-kml-popup p-1 font-sans">
      <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">
        {name}
      </h3>
      <div className="text-sm max-h-64 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left">
          <tbody>
            {lines.map((line, index) => {
              // [FIX] Mengganti regex .split() dengan indexOf() untuk kompatibilitas lebih luas
              const indexOfFirstColon = line.indexOf(":");
              const hasColon = indexOfFirstColon > -1;

              const label = hasColon
                ? line.substring(0, indexOfFirstColon)
                : "";
              const value = hasColon
                ? line.substring(indexOfFirstColon + 1).trim()
                : line.trim();

              if (!value) return null;

              if (hasColon) {
                return (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-1.5 pr-2 align-top font-semibold text-gray-600 w-1/3">
                      {label}
                    </td>
                    <td className="py-1.5 text-gray-800">
                      {renderValue(value)}
                    </td>
                  </tr>
                );
              } else {
                return (
                  <tr key={index} className="border-b border-gray-100">
                    <td
                      colSpan={2}
                      className="py-2 font-semibold text-gray-700"
                    >
                      {value}
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WilayahLayer() {
  const [geoJsonData, setGeoJsonData] = useState<GeoJsonObject | null>(null);
  useEffect(() => {
    fetch(GEOJSON_WILAYAH_PATH)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data GeoJSON");
        return res.json();
      })
      .then((data) => setGeoJsonData(data))
      .catch((err) => console.error("Error GeoJSON:", err));
  }, []);

  if (!geoJsonData) return null;

  return (
    <GeoJSON
      data={geoJsonData}
      style={(feature?: Feature) => ({
        color: feature?.properties?.stroke || "#1e40af",
        weight: feature?.properties?.["stroke-width"] || 2,
        fillColor: feature?.properties?.fill || "#3b82f6",
        fillOpacity: feature?.properties?.["fill-opacity"] || 0.4,
      })}
      onEachFeature={(feature, layer) => {
        const props = feature.properties || {};
        const name = props.name || props.NAMOBJ || "Wilayah Tidak Diketahui";
        layer.bindPopup(
          `<div class="p-1"><h4 class="font-medium">Wilayah: ${name}</h4></div>`
        );
      }}
    />
  );
}

function TitikSatwaLayer({
  onPointsLoad,
  onBoundsLoad,
  activePointId,
}: {
  onPointsLoad: (points: KmlPoint[]) => void;
  onBoundsLoad: (bounds: LatLngBounds) => void;
  activePointId: string | null;
}) {
  const [points, setPoints] = useState<KmlPoint[]>([]);
  const markerRefs = useRef<Record<string, LeafletMarkerType>>({});
  const map = useMap();

  useEffect(() => {
    let isMounted = true;
    const loadAndParseKML = async () => {
      try {
        const omnivore: any = await import("@mapbox/leaflet-omnivore");
        if (!omnivore || typeof omnivore.kml !== "function") {
          console.error("Gagal mengimpor leaflet-omnivore.");
          return;
        }

        const kmlLayer = omnivore.kml(KML_SATWA_PATH);

        kmlLayer.on("ready", function (this: OmnivoreLayer) {
          if (!isMounted) return;

          const extractedPoints: KmlPoint[] = [];
          let pointIdCounter = 0;

          this.eachLayer((layer: any) => {
            if (layer instanceof L.Marker) {
              const props = layer.feature?.properties || {};
              const name = props.name || "Titik Tidak Bernama";
              const description = props.description || "Tidak ada deskripsi.";
              const coords = layer.getLatLng();
              const pointId = `kml-point-${name
                .replace(/\s+/g, "-")
                .toLowerCase()}-${pointIdCounter++}`;
              extractedPoints.push({
                id: pointId,
                name,
                description,
                latlng: [coords.lat, coords.lng],
              });
            }
          });

          setPoints(extractedPoints);
          onPointsLoad(extractedPoints);

          if (this.getBounds && this.getBounds().isValid()) {
            onBoundsLoad(this.getBounds());
          }
        });

        kmlLayer.on("error", (err: any) => {
          if (isMounted)
            console.error("Error memuat file KML:", err?.error || err);
        });
      } catch (error) {
        if (isMounted) console.error("Error saat setup Omnivore:", error);
      }
    };

    if (map) loadAndParseKML();
    return () => {
      isMounted = false;
    };
  }, [map, onPointsLoad, onBoundsLoad]);

  useEffect(() => {
    if (activePointId && markerRefs.current[activePointId]) {
      const marker = markerRefs.current[activePointId];
      map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 13), {
        animate: true,
        duration: MAP_FLY_TO_DURATION,
      });
      setTimeout(() => marker.openPopup(), MAP_FLY_TO_DURATION * 1000);
    }
  }, [activePointId, map]);

  return (
    <Fragment>
      {points.map((point) => (
        <Marker
          key={point.id}
          position={point.latlng}
          ref={(ref) => {
            if (ref) markerRefs.current[point.id] = ref;
          }}
        >
          <Popup minWidth={DEFAULT_POPUP_WIDTH} maxWidth={DEFAULT_POPUP_WIDTH}>
            <PopupContent name={point.name} description={point.description} />
          </Popup>
        </Marker>
      ))}
    </Fragment>
  );
}

function FitBoundsControl({
  boundsToFit,
  defaultBounds,
}: {
  boundsToFit: LatLngBounds | null;
  defaultBounds: LatLngBoundsExpression;
}) {
  const map = useMap();
  const handleFitBounds = () => {
    const targetBounds =
      boundsToFit && boundsToFit.isValid() ? boundsToFit : defaultBounds;
    map.flyToBounds(targetBounds, {
      padding: [50, 50],
      duration: MAP_FLY_TO_DURATION,
    });
  };
  const buttonStyle: CSSProperties = {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 1000,
    background: "white",
    padding: "8px",
    border: "2px solid rgba(0,0,0,0.2)",
    borderRadius: "4px",
    cursor: "pointer",
    boxShadow: "0 1px 5px rgba(0,0,0,0.65)",
  };
  return (
    <button
      type="button"
      onClick={handleFitBounds}
      style={buttonStyle}
      title="Lihat Semua Titik"
      className="leaflet-control"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M8 16a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
      </svg>
    </button>
  );
}

// --- Komponen Utama ---
export default function PetaSectionInteraktif() {
  const [sidebarPoints, setSidebarPoints] = useState<KmlPoint[]>([]);
  const [kmlDataBounds, setKmlDataBounds] = useState<LatLngBounds | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePointId, setActivePointId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const acehCenter: LatLngTuple = [4.695135, 96.749399];
  const initialMapBounds: LatLngBoundsExpression = [
    [2.0, 94.8],
    [6.1, 98.6],
  ];

  const handlePointsLoad = (points: KmlPoint[]) => {
    setSidebarPoints(points);
    setIsLoading(false);
  };

  return (
    <section
      id="peta-interaktif"
      className="relative min-h-screen bg-gray-50 py-16 md:py-24 scroll-mt-20 border-t"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
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
          <div className="w-full lg:w-1/3 h-auto lg:min-h-[550px] max-h-[550px] flex flex-col">
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
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-sm italic">
                      Memuat data...
                    </p>
                  </div>
                ) : sidebarPoints.length > 0 ? (
                  sidebarPoints.map((point, index) => (
                    <button
                      type="button"
                      key={point.id}
                      className="p-3.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-white hover:shadow-md hover:border-green-300 transition-all duration-200 cursor-pointer text-left w-full block focus:outline-none focus:ring-2 focus:ring-green-500"
                      onClick={() => setActivePointId(point.id)}
                    >
                      <h4 className="font-semibold text-sm text-gray-800 mb-1">
                        {index + 1}. {point.name}
                      </h4>
                      <p className="text-xs text-gray-600 leading-snug line-clamp-3">
                        {point.description
                          .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, "$1")
                          .replace(/<[^>]+>/g, " ")
                          .replace(/\s+/g, " ")
                          .trim()
                          .substring(0, 150)}
                        ...
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-sm">
                      Data tidak ditemukan.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/3 h-[450px] md:h-[500px] lg:h-[550px]">
            {isClient ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-xl shadow-2xl overflow-hidden border-2 border-green-300 h-full"
              >
                <MapContainer
                  center={acehCenter}
                  zoom={8}
                  className="w-full h-full"
                  scrollWheelZoom={true}
                  bounds={initialMapBounds}
                >
                  <TileLayer
                    url={TILE_LAYER_URL}
                    attribution={TILE_LAYER_ATTRIBUTION}
                  />
                  <WilayahLayer />
                  <TitikSatwaLayer
                    onPointsLoad={handlePointsLoad}
                    onBoundsLoad={setKmlDataBounds}
                    activePointId={activePointId}
                  />
                  <FitBoundsControl
                    boundsToFit={kmlDataBounds}
                    defaultBounds={initialMapBounds}
                  />
                </MapContainer>
              </motion.div>
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <p>Memuat Peta...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
