import { DataFormat } from "@/types/geojson";
import { LeafletCoordinates, toLeafletCoordinates } from "@/types/geojson";
import { useEffect, useMemo, useRef, useState } from "react";

type UseMapViewportParams = {
  points: DataFormat[];
  initialZoom?: number;
};

export function useMapViewport({
  points,
  initialZoom = 8,
}: UseMapViewportParams) {
  const [position, setPosition] = useState<LeafletCoordinates>([0, 0]);
  const [zoom, setZoom] = useState(initialZoom);
  const zoomInteractionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (zoomInteractionTimeoutRef.current) {
        clearTimeout(zoomInteractionTimeoutRef.current);
      }
    };
  }, []);

  const mapPosition = useMemo(() => {
    if (position.every((value) => value === 0) && points[0]) {
      return toLeafletCoordinates(points[0].geometry.coordinates);
    }

    return position;
  }, [points, position]);

  const markZoomInteraction = () => {
    if (zoomInteractionTimeoutRef.current) {
      clearTimeout(zoomInteractionTimeoutRef.current);
    }

    zoomInteractionTimeoutRef.current = setTimeout(() => {
      zoomInteractionTimeoutRef.current = null;
    }, 100);
  };

  const handleZoomIn = () => {
    setZoom((currentZoom) => currentZoom + 1);
    markZoomInteraction();
  };

  const handleZoomOut = () => {
    setZoom((currentZoom) => currentZoom - 1);
    markZoomInteraction();
  };

  const syncZoom = (value: number) => {
    setZoom(value);
  };

  const shouldIgnoreDoubleClick = () => zoomInteractionTimeoutRef.current !== null;

  return {
    zoom,
    syncZoom,
    setPosition,
    mapPosition,
    handleZoomIn,
    handleZoomOut,
    shouldIgnoreDoubleClick,
  };
}
