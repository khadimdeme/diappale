"use client";

import { useEffect, useMemo, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { locateVille, type Place } from "@/lib/diapale/senegalCities";
import type { JobOffer } from "@/lib/diapale/types";

export default function OffersMap({ offers }: { offers: JobOffer[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { groups, unlocated } = useMemo(() => {
    const byPlace = new Map<string, { place: Place; offers: JobOffer[] }>();
    let missing = 0;
    for (const offer of offers) {
      const place = locateVille(offer.ville);
      if (!place) {
        missing += 1;
        continue;
      }
      const group = byPlace.get(place.name) ?? { place, offers: [] };
      group.offers.push(offer);
      byPlace.set(place.name, group);
    }
    return { groups: Array.from(byPlace.values()), unlocated: missing };
  }, [offers]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let map: import("leaflet").Map | null = null;
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !container) return;

      map = L.map(container, { scrollWheelZoom: false }).setView([14.5, -14.5], 6);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "© OpenStreetMap",
      }).addTo(map);

      const bounds: [number, number][] = [];

      for (const { place, offers: placeOffers } of groups) {
        const icon = L.divIcon({
          className: "",
          html: `<div style="width:34px;height:34px;border-radius:50%;background:#1f8c63;color:#fff;font:700 14px Helvetica,Arial,sans-serif;display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.35)">${placeOffers.length}</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const popup = document.createElement("div");
        const title = document.createElement("div");
        title.textContent = `${place.name} · ${placeOffers.length} offre${placeOffers.length > 1 ? "s" : ""}`;
        title.style.cssText = "font-weight:700;margin-bottom:6px";
        popup.appendChild(title);
        for (const offer of placeOffers) {
          const link = document.createElement("a");
          link.href = `/offres/${offer.id}`;
          link.textContent = offer.titre;
          link.style.cssText = "display:block;color:#1f8c63;font-weight:600;margin-top:4px;text-decoration:underline";
          popup.appendChild(link);
        }

        L.marker([place.lat, place.lng], { icon }).addTo(map).bindPopup(popup);
        bounds.push([place.lat, place.lng]);
      }

      if (bounds.length > 1) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 9 });
      else if (bounds.length === 1) map.setView(bounds[0], 10);
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [groups]);

  return (
    <div className="mt-4">
      <div
        ref={containerRef}
        className="h-[420px] w-full overflow-hidden rounded-2xl border border-border"
      />
      <p className="mt-2 text-xs text-muted">
        {groups.length === 0
          ? "Aucune offre à placer sur la carte pour ces filtres."
          : "Touche un point pour voir les offres de cette ville."}
        {unlocated > 0 &&
          ` ${unlocated} offre${unlocated > 1 ? "s" : ""} sans ville reconnue ne figure${unlocated > 1 ? "nt" : ""} pas sur la carte, mais reste${unlocated > 1 ? "nt" : ""} visible${unlocated > 1 ? "s" : ""} dans la liste.`}
      </p>
    </div>
  );
}
