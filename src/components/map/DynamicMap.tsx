"use client";
import { DataFormat } from "@/types/geojson";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import PointsRenderer from "./Points";
import { getAllFeatures } from "@/services/dbHandler";
import LoadingScreen from "./LoadingScreen";

export default function DynamicMap() {
  const [points, setPoints] = useState<[string, DataFormat][]>([]);
  const [isLoading, setIsLoading] = useState(false)

  const zoom = 5
  const maxZoom = 18
  const minZoom = 2
  const firstPoint = points?.[0]?.[1]
  const position = firstPoint?.geometry.coordinates || [0, 0] as [number, number];
  const outerBounds = [[90, 180], [-90, -180]] as [[number, number], [number, number]];

  async function load() {
    const result = await getAllFeatures();
    const mapEntries = Object.entries(result.json);
    const filteredPoints = mapEntries.filter(
      ([, result]) => result.geometry.type === "Point"
    );
    setPoints(filteredPoints);
  }

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

  return isLoading
    ? <LoadingScreen message="Loading locations..." />
    : (
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
        <TileLayer
          attribution=""
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <PointsRenderer
          points={points}
          load={load}
        />
      </MapContainer>
    );
}
