import { LeafletCoordinates } from "@/types/geojson";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function ChangeView({
  position,
  zoom,
}: {
  position: LeafletCoordinates;
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);

  useEffect(() => {
    map.setZoom(zoom);
  }, [zoom, map]);

  return null;
}
