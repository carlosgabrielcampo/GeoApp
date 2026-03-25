"use client";

import { createFeature, deleteFeature, getAllFeatures, updateFeature } from "@/services/dbHandler";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import FeatureIcon from "@/assets/icons/pino-de-localizacao.ico";
import {
  DataFormat,
  LeafletCoordinates,
  toGeoJsonCoordinates,
  toLeafletCoordinates,
} from "@/types/geojson";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import PointsRenderer from "./Points";
import LoadingScreen from "../providers/LoadingScreenProvider";
import SidebarProvider from "../providers/SidebarProvider";
import L, { Icon, IconOptions } from "leaflet";
import { EditablePoint, PointSelection } from "@/types/points";
import PointHandler from "../modal/PointHandler";
import { toast } from "react-toastify";
import { ZoomIn, ZoomOut } from "lucide-react";

export default function DynamicMap() {
  const [selectedPoint, setSelectedPoint] = useState<EditablePoint | null>(null);
  const [newPointCoord, setNewPointCoord] = useState<LeafletCoordinates | null>(null);
  const [isPickingCoordinates, setIsPickingCoordinates] = useState(false);
  const [position, setPosition] = useState<LeafletCoordinates>([0, 0]);
  const [points, setPoints] = useState<DataFormat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(8);

  const minZoom = 2;
  const maxZoom = 18;
  const outerBounds = [[90, 180], [-90, -180]] as [[number, number], [number, number]];
  const emptyPoint: EditablePoint = {
    type: "Feature",
    geometry: { type: "Point" },
    properties: { name: "", description: "" },
  };

  const load = useCallback(async () => {
    const data = await getAllFeatures();
    const filteredPoints = data.features.filter(
      (feature): feature is DataFormat => feature.geometry.type === "Point"
    );
    const firstPoint = filteredPoints[0];

    if (firstPoint) {
      setPosition((currentPosition) =>
        currentPosition.every((value) => value === 0)
          ? toLeafletCoordinates(firstPoint.geometry.coordinates)
          : currentPosition
      );
    }

    setPoints(filteredPoints);
  }, []);

  useEffect(() => {
    const loadGeojson = async () => {
      try {
        setIsLoading(true);
        await load();
      } catch (error) {
        console.error(error);
        toast.error("Failed to load points.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadGeojson();
  }, [load]);

  const deletePoint = async (id: string) => {
    try {
      await deleteFeature(id);
      setSelectedPoint(null);
      setIsPickingCoordinates(false);
      setNewPointCoord(null);
      await load();
      toast.success("Point deleted successfully.");
    } catch (error) {
      console.error("Failed to delete point", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete point.");
    }
  };

  const savePoint = async (feature: DataFormat) => {
    try {
      if (feature.geometry.coordinates.some((value) => !Number.isFinite(value))) {
        toast.error("Coordinates not set.");
        return;
      }

      if (selectedPoint?.id) {
        await updateFeature(selectedPoint.id, feature);
        toast.success("Point updated successfully.");
      } else {
        await createFeature({
          coordinates: feature.geometry.coordinates,
          name: feature.properties.name,
          description: feature.properties.description,
        });
        toast.success("Point created successfully.");
      }

      setSelectedPoint(null);
      setIsPickingCoordinates(false);
      setNewPointCoord(null);
      await load();
    } catch (error) {
      console.error("Failed to save point", error);
      toast.error(error instanceof Error ? error.message : "Failed to save point.");
    }
  };

  const startCoordinatePicking = () => {
    setIsPickingCoordinates(true);
    toast.info("Double click the map to choose coordinates.");
  };

  const updateDraftField = (field: "name" | "description", value: string) => {
    setSelectedPoint((currentPoint) => {
      if (!currentPoint) return currentPoint;

      return {
        ...currentPoint,
        properties: {
          ...currentPoint.properties,
          [field]: value,
        },
      };
    });
  };

  const updateCoordinates = (value: DataFormat["geometry"]["coordinates"]) => {
    setSelectedPoint((currentPoint) => {
      if (!currentPoint) return currentPoint;

      return {
        ...currentPoint,
        geometry: {
          ...currentPoint.geometry,
          coordinates: value,
        },
      };
    });
  };

  const clickPoint = (selected: PointSelection) => {
    setIsPickingCoordinates(false);
    setNewPointCoord(null);
    setPosition(toLeafletCoordinates(selected.geometry.coordinates));
    setSelectedPoint(selected);
  };

  const iconByType: Record<DataFormat["type"], Icon<IconOptions>> = {
    Feature: L.icon({
      iconUrl: FeatureIcon.src ?? FeatureIcon,
      iconSize: [32, 32],
    }),
  };

  const isModalOpen = Boolean(selectedPoint) && !isPickingCoordinates;

  return isLoading ? (
    <LoadingScreen message="Loading locations..." />
  ) : (
    <>
      <MapContainer
        zoom={zoom}
        center={position}
        minZoom={minZoom}
        maxZoom={maxZoom}
        zoomControl={false}
        maxBounds={outerBounds}
        doubleClickZoom={false}
        className="h-[100vh] w-[100vw]"
      >
        <ChangeView position={position} zoom={zoom} />
        <TileLayer attribution="" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <PointsRenderer
          points={points}
          iconByType={iconByType}
          clickPoint={clickPoint}
          newPoint={newPointCoord}
        />
        <ZoomHandler setZoom={setZoom} />
        <MapEventsHandler
          onPickCoordinates={(coordinates) => {
            const geoJsonCoordinates = toGeoJsonCoordinates(coordinates);

            setSelectedPoint((currentPoint) => ({
              ...(currentPoint ?? { ...emptyPoint }),
              geometry: {
                type: "Point",
                coordinates: geoJsonCoordinates,
              },
            }));
            setNewPointCoord(coordinates);
            setIsPickingCoordinates(false);
            toast.success("Coordinates selected.");
          }}
          isModalOpen={isModalOpen}
          setPosition={setPosition}
          setZoom={setZoom}
        />
        <PointHandler
          onChangeCoordinates={startCoordinatePicking}
          updateCoordinates={updateCoordinates}
          onChangeDetails={updateDraftField}
          selectedPoint={selectedPoint}
          isOpen={isModalOpen}
          onClose={() => {
            setIsPickingCoordinates(false);
            setSelectedPoint(null);
            setNewPointCoord(null);
          }}
          onConfirm={(feature) => {
            void savePoint(feature);
          }}
          onDelete={() => {
            if (!selectedPoint?.id) return;
            void deletePoint(selectedPoint.id);
          }}
        />
      </MapContainer>
      {!isPickingCoordinates ? (
        <SidebarProvider
          points={points}
          clickPoint={clickPoint}
          setSelectedPoint={setSelectedPoint}
          sidebarIconSrc={FeatureIcon.src ?? FeatureIcon}
          setIsPickingCoordinates={setIsPickingCoordinates}
          defaultPoint={emptyPoint}
        />
      ) : null}
    </>
  );
}

function ChangeView({
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

function MapEventsHandler({
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

function ZoomHandler({ setZoom }: { setZoom: Dispatch<SetStateAction<number>> }) {
  return (
    <div className="pointer-events-auto absolute right-4 bottom-4 z-[400] gap-2 flex max-h-[calc(100vh-2rem)]">
      <button
        type="button"
        onClick={() => setZoom((prev) => prev + 1)}
        className="mt-4 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:bg-slate-50"
      >
        <ZoomIn size={20} />
      </button>
      <button
        type="button"
        onClick={() => setZoom((prev) => prev - 1)}
        className="mt-4 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:bg-slate-50"
      >
        <ZoomOut size={20} />
      </button>
    </div>
  );
}
