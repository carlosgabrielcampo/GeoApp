"use client";
import { GetAllReturn } from "@/database/db";
import { DataFormat } from "@/types/geojson";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import PointsRenderer from "./Points";

type Props = {
  setNewPoint: (event: [number, number]) => void;
};

export default function DynamicMap() {
  const [points, setPoints] = useState<[string, DataFormat][]>([]);
  const [newPoint, setNewPoint] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false)

  const firstPoint = points?.[0]?.[1]
  const position = firstPoint?.geometry.coordinates || [0, 0] as [number, number];
  const zoom = 5
  const maxZoom = 18
  const minZoom = 2
  const outerBounds = [[90, 180], [-90, -180]] as [[number, number], [number, number]];

  useEffect(() => {
    async function loadGeojson() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/geojson");

        if (!response.ok) {
          throw new Error("Failed to fetch geojson");
        }

        const result = await response.json() as GetAllReturn
        const mapEntries = Object.entries(result.json)
        const filteredPoints = mapEntries.filter(([, result]) => result.geometry.type === 'Point')
        setPoints(filteredPoints);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false)
      }
    }

    loadGeojson();
  }, []);



  return isLoading
    ? <></>
    : <MapContainer
      center={position}
      maxBounds={outerBounds}
      zoom={zoom}
      className='map'
      minZoom={minZoom}
      maxZoom={maxZoom}
      doubleClickZoom={false}
    >
      <TileLayer
        attribution=''
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationFinder setNewPoint={setNewPoint} />
      <PointsRenderer points={points} newPoint={newPoint}/>

    </MapContainer>
}

// 1. Create a component to handle map events
function LocationFinder(LocationHandler: Props) {
  useMapEvents({
    dblclick(e) {
      const { lat, lng } = e.latlng;
      LocationHandler.setNewPoint([lat, lng])
    },
  });
  return null
}