"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import FeatureIcon from "@/assets/icons/pino-de-localizacao.ico";
import { DataFormat, LeafletCoordinates, toLeafletCoordinates } from "@/types/geojson";
import { useState } from "react";
import PointsRenderer from "./Points";
import LoadingScreen from "../providers/LoadingScreenProvider";
import SidebarProvider from "../providers/SidebarProvider";
import L, { Icon, IconOptions } from "leaflet";
import { EditablePoint } from "@/types/points";
import PointHandler from "../modal/PointHandler";
import { ZoomHandler } from "./controls/ZoomHandler";
import { MapEventsHandler } from "./controls/MapEventsHandler";
import { ChangeView } from "./controls/ChangeView";
import { usePointEditor } from "./hooks/usePointEditor";
import { useMapPoints } from "./hooks/useMapPoints";

export default function DynamicMap() {
  const [position, setPosition] = useState<LeafletCoordinates>([0, 0]);
  const [zoom, setZoom] = useState(8);

  const minZoom = 2;
  const maxZoom = 18;
  const outerBounds = [[90, 180], [-90, -180]] as [[number, number], [number, number]];
  const emptyPoint: EditablePoint = {
    type: "Feature",
    geometry: { type: "Point" },
    properties: { name: "", description: "" },
  };
  const {
    clickPoint,
    isModalOpen,
    resetEditor,
    selectedPoint,
    newPointCoord,
    setSelectedPoint,
    updateDraftField,
    selectCoordinates,
    updateCoordinates,
    isPickingCoordinates,
    startCoordinatePicking,
    setIsPickingCoordinates,
  } = usePointEditor({
    defaultPoint: emptyPoint,
    setPosition,
  });
  const { deletePoint, isLoading, points, savePoint } = useMapPoints();
  const mapPosition =
    position.every((value) => value === 0) && points[0]
      ? toLeafletCoordinates(points[0].geometry.coordinates)
      : position;

  const handleSavePoint = async (feature: DataFormat) => {
    const didSave = await savePoint(feature, selectedPoint?.id);
    if (didSave) { resetEditor(); }
  };

  const handleDeletePoint = async () => {
    if (!selectedPoint?.id) { return; }
    const didDelete = await deletePoint(selectedPoint.id);
    if (didDelete) { resetEditor(); }
  };

  const iconByType: Record<DataFormat["type"], Icon<IconOptions>> = {
    Feature: L.icon({
      iconUrl: FeatureIcon.src ?? FeatureIcon,
      iconSize: [32, 32],
    }),
  };

  return isLoading ? (
    <LoadingScreen message="Loading locations..." />
  ) : (
    <>
      <MapContainer
        zoom={zoom}
        center={mapPosition}
        minZoom={minZoom}
        maxZoom={maxZoom}
        zoomControl={false}
        maxBounds={outerBounds}
        doubleClickZoom={false}
        className="h-[100vh] w-[100vw]"
      >
        <ChangeView
          position={mapPosition}
          zoom={zoom}
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
        <ZoomHandler setZoom={setZoom} />
        <MapEventsHandler
          onPickCoordinates={selectCoordinates}
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
          onClose={resetEditor}
          onConfirm={(feature) => {
            void handleSavePoint(feature);
          }}
          onDelete={() => {
            void handleDeletePoint();
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
