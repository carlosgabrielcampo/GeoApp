import { Dispatch, SetStateAction } from "react";
import { LeafletCoordinates } from "@/types/geojson";
import { useMapEvents } from "react-leaflet";

export function MapEventsHandler({
  setZoom,
  setPosition,
  onPickCoordinates,
  isModalOpen,
}: {
  setZoom: Dispatch<SetStateAction<number>>;
  setPosition: (coordinates: LeafletCoordinates) => void;
  onPickCoordinates: (coordinates: LeafletCoordinates) => void;
  isModalOpen: boolean;
}) {
  const map = useMapEvents({
    dblclick(event) {
      if (!isModalOpen) {
        const coordinates: LeafletCoordinates = [event.latlng.lat, event.latlng.lng];
        onPickCoordinates(coordinates);
        setPosition(coordinates);
      }
    },
    zoomend() {
      setZoom(map.getZoom());
    },
  });

  return null;
}