"use client";

import { useEffect, useRef } from "react";
import type { CityLivingCost } from "@/types";

interface Props {
  cities: CityLivingCost[];
  selectedIds?: string[];
}

export default function CityMap({ cities, selectedIds = [] }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const L = require("leaflet");

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const map = L.map(mapRef.current, {
      center: [30, 40],
      zoom: 2,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    cities.forEach((city) => {
      const isSelected = selectedIds.includes(city.city.id);

      const markerHtml = `
        <div style="
          background: ${isSelected ? "#6366f1" : "#21262d"};
          border: 2px solid ${isSelected ? "#818cf8" : "#30363d"};
          border-radius: 50%;
          width: 12px;
          height: 12px;
          box-shadow: 0 0 ${isSelected ? "12px rgba(99,102,241,0.6)" : "4px rgba(0,0,0,0.4)"};
        "></div>`;

      const icon = L.divIcon({
        html: markerHtml,
        className: "",
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      const marker = L.marker([city.city.lat, city.city.lng], { icon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; min-width: 140px;">
          <p style="font-weight: 600; color: #fff; margin: 0 0 4px 0;">${city.city.name}</p>
          <p style="color: #8b949e; font-size: 12px; margin: 0 0 2px 0;">${city.city.country}</p>
          <p style="color: #6366f1; font-size: 14px; font-weight: 700; margin: 4px 0 0 0;">
            $${city.monthly_total_usd.toLocaleString()}/mo
          </p>
          <p style="color: ${city.annual_inflation > 10 ? "#ef4444" : "#10b981"}; font-size: 12px; margin: 2px 0 0 0;">
            Inflation: ${city.annual_inflation}%
          </p>
        </div>
      `, { className: "custom-popup" });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
  }, [selectedIds]);

  return (
    <div
      ref={mapRef}
      className="h-[320px] w-full rounded-xl overflow-hidden"
      style={{ background: "#0d1117" }}
    />
  );
}
