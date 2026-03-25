"use client";
import { createFeature, deleteFeature, getAllFeatures, updateFeature } from "@/services/dbHandler";
import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import FeatureIcon from '@/assets/icons/pino-de-localizacao.ico'
import { DataFormat } from "@/types/geojson";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import PointsRenderer from "./Points";
import LoadingScreen from "./LoadingScreen";
import SidebarProvider from "../providers/SidebarProvider";
import L, { Icon, IconOptions } from 'leaflet'
import { EditablePoint, PointSelection } from "@/types/points";
import PointInsert from "../modal/pointInsert";
import { toast } from "react-toastify";

export default function DynamicMap() {
  const [selectedPoint, setSelectedPoint] = useState<EditablePoint | null>(null)
  const [newPointCoord, setNewPointCoord] = useState<[number, number] | null>(null)
  const [isPickingCoordinates, setIsPickingCoordinates] = useState(false);
  const [position, setPosition] = useState<[number, number]>([0, 0])
  const [points, setPoints] = useState<[string, DataFormat][]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [zoom, setZoom] = useState(5)

  const minZoom = 2
  const maxZoom = 18
  const outerBounds = [[90, 180], [-90, -180]] as [[number, number], [number, number]];

  const EMPTY_POINT: EditablePoint = {
    type: "Feature",
    geometry: {
      type: "Point",
    },
    properties: {
      name: "",
      description: "",
    },
  };

  const load = useCallback(async () => {
    const result = await getAllFeatures();
    const data = result.json;
    if (!data || typeof data !== "object" || "message" in data) {
      setPoints([]);
      return;
    }

    const mapEntries = Object.entries(data);
    const filteredPoints = mapEntries.filter(
      (entry): entry is [string, DataFormat] => entry[1].geometry.type === "Point"
    );
    const firstPoint = filteredPoints?.[0]?.[1]
    if (firstPoint) {
      setPosition((currentPosition) =>
        currentPosition.every((value) => value === 0)
          ? firstPoint.geometry.coordinates
          : currentPosition
      );
    }
    setPoints(filteredPoints);
  }, []);

  const iconByType: Record<DataFormat["type"], Icon<IconOptions>> = {
    Feature: L.icon({
      iconUrl: FeatureIcon.src ?? FeatureIcon,
      iconSize: [32, 32],
    }),
  };
  const isModalOpen = Boolean(selectedPoint) && !isPickingCoordinates;

  const deletePoint = async (id: string) => {
    try {
      await deleteFeature(id);
      setSelectedPoint(null);
      setIsPickingCoordinates(false);
      await load();
      toast.success("Point deleted successfully.");
    } catch (error) {
      console.error("Failed to delete point", error);
      toast.error("Failed to delete point.");
    }
  };

  const savePoint = async (feature: DataFormat) => {
    try {
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
      await load();
    } catch (error) {
      console.error("Failed to save point", error);
      toast.error("Failed to save point.");
    }
  };

  const startCoordinatePicking = () => {
    setIsPickingCoordinates(true);
    toast.info("Double click the map to choose coordinates.");
  };

  const updateDraftField = (field: "name" | "description", value: string) => {
    setSelectedPoint((currentPoint) => {
      if (!currentPoint) {
        return currentPoint;
      }

      return {
        ...currentPoint,
        properties: {
          ...currentPoint.properties,
          [field]: value,
        },
      };
    });
  };

  useEffect(() => {
    const loadGeojson = async () => {
      try {
        setIsLoading(true);
        await load();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadGeojson();
  }, [load]);

  const clickPoint = (selected: PointSelection) => {
    setIsPickingCoordinates(false);
    setPosition(selected.geometry.coordinates)
    setSelectedPoint(selected)
  };

  return isLoading
    ? <LoadingScreen message="Loading locations..." />
    : (
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
          <ChangeView
            position={position}
          />
          <TileLayer
            attribution=""
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <PointsRenderer
            points={points}
            iconByType={iconByType}
            clickPoint={clickPoint}
            newPoint={newPointCoord}
          />
          <MapEventsHandler
            onPickCoordinates={(coordinates) => {
              setSelectedPoint((currentPoint) => ({
                ...(currentPoint ?? { ...EMPTY_POINT }),
                geometry: {
                  type: "Point",
                  coordinates,
                },
              }
              ));
              setNewPointCoord(coordinates)
              setIsPickingCoordinates(false);
              toast.success("Coordinates selected.");
            }}
            setZoom={setZoom}
            setPosition={setPosition}
          />
          <PointInsert
            onChangeCoordinates={startCoordinatePicking}
            onChangeDetails={updateDraftField}
            selectedPoint={selectedPoint}
            isOpen={isModalOpen}
            onClose={() => {
              setIsPickingCoordinates(false);
              setSelectedPoint(null)
              setNewPointCoord(null)
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
        <SidebarProvider
          points={points}
          sidebarIconSrc={FeatureIcon.src ?? FeatureIcon}
          clickPoint={clickPoint}
          setIsPickingCoordinates={setIsPickingCoordinates}
          setSelectedPoint={setSelectedPoint}
          EMPTY_POINT={EMPTY_POINT}
        />

      </>
    );
}

function ChangeView({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);
  return null;
}

function MapEventsHandler({
  setZoom,
  setPosition,
  onPickCoordinates,
}: {
  setZoom: Dispatch<SetStateAction<number>>;
  setPosition: (coordinates: [number, number]) => void;
  onPickCoordinates: (coordinates: [number, number]) => void;
}) {
  const map = useMapEvents({
    dblclick(event) {
      onPickCoordinates([event.latlng.lat, event.latlng.lng]);
      setPosition([event.latlng.lat, event.latlng.lng])
    },
    zoomend() {
      setZoom(map.getZoom());
    },
  });

  return null;
}
