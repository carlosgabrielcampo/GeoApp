import { Dispatch, SetStateAction } from "react";
import { LeafletCoordinates } from "@/types/geojson";
import { useMapEvents } from "react-leaflet";

export function MapEventsHandler({
  setZoom,
  isModalOpen,
  setPosition,
  zoomPressed,
  onPickCoordinates,
}: {
  isModalOpen: boolean;
  zoomPressed: boolean;
  setZoom: Dispatch<SetStateAction<number>>;
  setPosition: (coordinates: LeafletCoordinates) => void;
  onPickCoordinates: (coordinates: LeafletCoordinates) => void;
}) {
  const map = useMapEvents({
    dblclick(event) {
      console.log('zoomPressed', zoomPressed)
      if (!isModalOpen && !zoomPressed) {
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