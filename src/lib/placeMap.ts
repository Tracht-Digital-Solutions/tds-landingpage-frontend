/**
 * The footer's live map (2026-10-12): OpenStreetMap tiles through Leaflet,
 * mounted over the drawn map (`ui/PlaceMap.astro`) the first time the
 * location bubble opens. It can be dragged and zoomed; Schwarzenbek carries a
 * pin and the dashed area around it reaches Bergedorf.
 *
 * Third-party tiles, loaded on HOVER without a consent step — asked for in
 * exactly that form, with the data transfer to the OpenStreetMap Foundation
 * stated in the privacy policy. Nothing is fetched before the bubble opens:
 * Leaflet, its CSS and every tile come with the first open. The drawn map
 * stays underneath as the picture without JavaScript or while tiles load.
 */
import type { Lang } from "./i18n";

/** Schwarzenbek, town centre. */
export const PLACE_CENTER: [number, number] = [53.5045, 10.479];
/** Bergedorf, the far edge of the dashed area. */
export const PLACE_EDGE: [number, number] = [53.4885, 10.2119];

/** Great-circle distance in metres (the area's radius: Schwarzenbek → Bergedorf). */
export function distanceMeters(a: [number, number], b: [number, number]): number {
  const rad = Math.PI / 180;
  const dLat = (b[0] - a[0]) * rad;
  const dLon = (b[1] - a[1]) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.sqrt(h));
}

export interface LiveMap {
  /** Leaflet measures its box once; the bubble was hidden then, so measure again on every open. */
  refresh: () => void;
  /** True while the map is being dragged (the bubble must not close under the hand). */
  busy: () => boolean;
}

export async function mountLiveMap(container: HTMLElement, lang: Lang): Promise<LiveMap> {
  const [{ default: L }] = await Promise.all([import("leaflet"), import("leaflet/dist/leaflet.css")]);
  const pink = getComputedStyle(document.documentElement).getPropertyValue("--color-accent-pink").trim() || "#f28cb1";

  const map = L.map(container, {
    center: PLACE_CENTER,
    zoom: 10,
    minZoom: 8,
    maxZoom: 16,
    zoomControl: true,
    attributionControl: true,
  });
  map.attributionControl.setPrefix(false);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
  }).addTo(map);

  // The area: dashed, reaching Bergedorf.
  const area = L.circle(PLACE_CENTER, {
    radius: distanceMeters(PLACE_CENTER, PLACE_EDGE) + 600,
    color: pink,
    weight: 2,
    dashArray: "6 6",
    fillColor: pink,
    fillOpacity: 0.12,
    interactive: false,
  }).addTo(map);
  // Schwarzenbek itself: a pin and its name.
  L.circleMarker(PLACE_CENTER, {
    radius: 8,
    color: "#0f1563",
    weight: 3,
    fillColor: pink,
    fillOpacity: 1,
  })
    .bindTooltip("Schwarzenbek", { permanent: true, direction: "top", offset: [0, -10], className: "place-live__label" })
    .addTo(map);

  map.fitBounds(area.getBounds(), { padding: [8, 8] });
  container.setAttribute("aria-label", lang === "de" ? "Interaktive Karte um Schwarzenbek" : "Interactive map around Schwarzenbek");

  let dragging = false;
  map.on("dragstart", () => (dragging = true));
  map.on("dragend", () => (dragging = false));

  return {
    refresh: () => map.invalidateSize(),
    busy: () => dragging,
  };
}
