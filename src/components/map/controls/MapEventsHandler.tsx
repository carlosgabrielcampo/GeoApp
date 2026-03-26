import { LeafletCoordinates } from "@/types/geojson";
import { useMapEvents } from "react-leaflet";

export function MapEventsHandler({
  syncZoom,
  onPickCoordinates,
  canPickCoordinates,
  shouldIgnoreDoubleClick,
}: {
  canPickCoordinates: boolean;
  syncZoom: (zoom: number) => void;
  shouldIgnoreDoubleClick: () => boolean;
  onPickCoordinates: (coordinates: LeafletCoordinates) => void;
}) {
  const map = useMapEvents({
    dblclick(event) {
      if (canPickCoordinates || shouldIgnoreDoubleClick()) {
        return;
      }

      const coordinates: LeafletCoordinates = [event.latlng.lat, event.latlng.lng];
      onPickCoordinates(coordinates);
    },
    zoomend() {
      syncZoom(map.getZoom());
    },
  });

  return null;
}
