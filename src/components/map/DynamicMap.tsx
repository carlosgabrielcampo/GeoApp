"use client";
import { DataFormat } from "@/types/geojson";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import PointsRenderer from "./Points";
import { createFeature, deleteFeature, getAllFeatures, updateFeature } from "@/services/dbHandler";
import LoadingScreen from "./LoadingScreen";
import SidebarProvider from "../providers/SidebarProvider";
import FeatureIcon from '@/assets/icons/pino-de-localizacao.ico'
import L, { Icon, IconOptions } from 'leaflet'
import { EditablePoint } from "@/types/points";
import PointInsert from "../modal/pointInsert";
import { toast } from "react-toastify";

export default function DynamicMap() {
  
  const [points, setPoints] = useState<[string, DataFormat][]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPoint, setSelectedPoint] = useState<EditablePoint | null>(null)
  const [isPickingCoordinates, setIsPickingCoordinates] = useState(false);
  const [position, setPosition] = useState<[number, number]>( [0, 0])
  const [zoom, setZoom] = useState()

  const initialZoom = 5
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

  async function load() {
    const result = await getAllFeatures();
    const mapEntries = Object.entries(result.json);
    const filteredPoints = mapEntries.filter(
      ([, result]) => result.geometry.type === "Point"
    );
    const firstPoint = filteredPoints?.[0]?.[1]
    if(firstPoint) setPosition(firstPoint?.geometry.coordinates)
    setPoints(filteredPoints);
  }

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
  }, []);

  const clickPoint = (selected: { id: string } & DataFormat) => {
    setIsPickingCoordinates(false);
    setPosition(selected.geometry.coordinates)
    setSelectedPoint(selected)
  };

  return isLoading
    ? <LoadingScreen message="Loading locations..." />
    : (
      <>
        <MapContainer
          zoom={initialZoom}
          center={position}
          minZoom={minZoom}
          maxZoom={maxZoom}
          zoomControl={false}
          maxBounds={outerBounds}
          doubleClickZoom={false}
          className="h-[100vh] w-[100vw]"
        >
          <ChangeView center={position} zoom={initialZoom} />
          <TileLayer
            attribution=""
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <PointsRenderer
            points={points}
            iconByType={iconByType}
            clickPoint={clickPoint}
          />
          <MapEventsHandler
            onPickCoordinates={(coordinates) => {
              setSelectedPoint((currentPoint) => ({
                ...(currentPoint ?? { ...EMPTY_POINT }),
                geometry: {
                  type: "Point",
                  coordinates,
                },
              }));
              setIsPickingCoordinates(false);
              toast.success("Coordinates selected.");
            }}
          />
          <SidebarProvider
            points={points}
            sidebarIconSrc={FeatureIcon.src ?? FeatureIcon}
            clickPoint={clickPoint}
            setIsPickingCoordinates={setIsPickingCoordinates}
            setSelectedPoint={setSelectedPoint}
            EMPTY_POINT={EMPTY_POINT}
          />
        </MapContainer>
        <PointInsert
          selectedPoint={selectedPoint}
          isOpen={isModalOpen}
          isPickingCoordinates={isPickingCoordinates}
          onClose={() => {
            setIsPickingCoordinates(false);
            setSelectedPoint(null)
          }}
          onChangeDetails={updateDraftField}
          onConfirm={(feature) => {
            void savePoint(feature);
          }}
          onChangeCoordinates={startCoordinatePicking}
          onDelete={() => {
            if (!selectedPoint?.id) {
              return;
            }
            void deletePoint(selectedPoint.id);
          }}
        />
      </>
    );
}

function ChangeView({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom);
  }, [center, zoom, map]);

  return null;
}

function MapEventsHandler({
  onPickCoordinates,
}: {
  onPickCoordinates: (coordinates: [number, number]) => void;
}) {
  useMapEvents({
    dblclick(event) {
      onPickCoordinates([event.latlng.lat, event.latlng.lng]);
    },
  });

  return null;
}