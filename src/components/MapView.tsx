import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import type { Venue } from "../data/venues";

// Fix default marker icons for Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const selectedIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:30px;height:30px;background:#b93d59;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const defaultIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:20px;height:20px;background:#e07a8c;border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.25)"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function FlyTo({ venue }: { venue: Venue | null }) {
  const map = useMap();
  useEffect(() => {
    if (venue) map.flyTo([venue.lat, venue.lng], 14, { duration: 0.8 });
  }, [venue, map]);
  return null;
}

interface Props {
  venues: Venue[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function MapView({ venues, selectedId, onSelect }: Props) {
  const selected = venues.find((v) => v.id === selectedId) ?? null;
  return (
    <MapContainer
      center={[22.32, 114.17]}
      zoom={11}
      scrollWheelZoom
      className="h-full w-full rounded-2xl overflow-hidden"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyTo venue={selected} />
      {venues.map((v) => (
        <Marker
          key={v.id}
          position={[v.lat, v.lng]}
          icon={v.id === selectedId ? selectedIcon : defaultIcon}
          eventHandlers={{ click: () => onSelect(v.id) }}
        >
          <Popup>
            <div className="text-sm">
              <div className="font-semibold">{v.name}</div>
              <div className="text-xs text-slate-500">{v.district}</div>
              <div className="text-xs mt-1">★ {v.rating}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
