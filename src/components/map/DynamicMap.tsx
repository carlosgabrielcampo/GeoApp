"use client";

import { DataFormat, LeafletCoordinates, toLeafletCoordinates } from "@/types/geojson";
import FeatureIcon from "@/assets/icons/pino-de-localizacao.ico";
import LoadingScreen from "../providers/LoadingScreenProvider";
import { MapEventsHandler } from "./controls/MapEventsHandler";
import SidebarProvider from "../providers/SidebarProvider";
import { MapContainer, TileLayer } from "react-leaflet";
import { usePointEditor } from "./hooks/usePointEditor";
import { ZoomHandler } from "./controls/ZoomHandler";
import { useMapPoints } from "./hooks/useMapPoints";
import { ChangeView } from "./controls/ChangeView";
import PointHandler from "../modal/PointHandler";
import PointsRenderer from "./PointsRenderer";
import { useState } from "react";
import { emptyPoint } from "./constants";

export default function DynamicMap() {
  const [position, setPosition] = useState<LeafletCoordinates>([0, 0]);
  const [zoom, setZoom] = useState(8);
  const [zoomPressed, setZoomPressed] = useState(false)
  const minZoom = 2;
  const maxZoom = 18;
  const outerBounds = [[90, 180], [-90, -180]] as [[number, number], [number, number]];

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
  const mapPosition = position.every((value) => value === 0) && points[0]
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

  return isLoading ? (
    <LoadingScreen message="Loading locations..." />
  ) : (
    <>
      <MapContainer
        zoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        zoomControl={false}
        center={mapPosition}
        maxBounds={outerBounds}
        doubleClickZoom={false}
        className="h-[100vh] w-[100vw]"
      >
        <ChangeView
          zoom={zoom}
          position={mapPosition}
        />
        <TileLayer
          attribution=""
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <PointsRenderer
          points={points}
          clickPoint={clickPoint}
          newPoint={newPointCoord}
        />
        <ZoomHandler setZoom={setZoom} setZoomPressed={setZoomPressed} />
        <MapEventsHandler
          setZoom={setZoom}
          zoomPressed={zoomPressed}
          isModalOpen={isModalOpen}
          setPosition={setPosition}
          onPickCoordinates={selectCoordinates}
        />
        <PointHandler
          isOpen={isModalOpen}
          onClose={resetEditor}
          selectedPoint={selectedPoint}
          onChangeDetails={updateDraftField}
          updateCoordinates={updateCoordinates}
          onChangeCoordinates={startCoordinatePicking}
          onDelete={() => { void handleDeletePoint(); }}
          onConfirm={(feature) => { void handleSavePoint(feature); }}
        />
      </MapContainer>
      {!isPickingCoordinates ? (
        <SidebarProvider
          points={points}
          clickPoint={clickPoint}
          setSelectedPoint={setSelectedPoint}
          sidebarIconSrc={FeatureIcon.src ?? FeatureIcon}
          setIsPickingCoordinates={setIsPickingCoordinates}
        />
      ) : null}
    </>
  );
}
