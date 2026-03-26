"use client";

import LoadingScreen from "../providers/LoadingScreenProvider";
import { MapEventsHandler } from "./controls/MapEventsHandler";
import SidebarProvider from "../providers/SidebarProvider";
import { MapContainer, TileLayer } from "react-leaflet";
import { usePointEditor } from "./hooks/usePointEditor";
import { useMapViewport } from "./hooks/useMapViewport";
import { ZoomHandler } from "./controls/ZoomHandler";
import { useMapPoints } from "./hooks/useMapPoints";
import { ChangeView } from "./controls/ChangeView";
import PointHandler from "../modal/PointHandler";
import PointsRenderer from "./PointsRenderer";
import { DataFormat } from "@/types/geojson";
import { emptyPoint } from "./constants";

const MIN_ZOOM = 2;
const MAX_ZOOM = 18;
const OUTER_BOUNDS = [[90, 180], [-90, -180]] as [[number, number], [number, number]];

export default function DynamicMap() {
  const {
    deletePoint,
    savePoint,
    isLoading,
    points,
  } = useMapPoints();

  const {
    zoom,
    syncZoom,
    setPosition,
    mapPosition,
    handleZoomIn,
    handleZoomOut,
    shouldIgnoreDoubleClick,
  } = useMapViewport({ points });

  const {
    clickPoint,
    isModalOpen,
    resetEditor,
    selectedPoint,
    newPointCoord,
    openCreatePoint,
    updateDraftField,
    selectCoordinates,
    updateCoordinates,
    isPickingCoordinates,
    startCoordinatePicking,
  } = usePointEditor({
    defaultPoint: emptyPoint,
    setPosition,
  });

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
        minZoom={MIN_ZOOM} zoomControl={false} doubleClickZoom={false} maxBounds={OUTER_BOUNDS}
        center={mapPosition} zoom={zoom} maxZoom={MAX_ZOOM} className="h-[100vh] w-[100vw]"
      >
        <ChangeView
          zoom={zoom} position={mapPosition}
        />
        <ZoomHandler
          onZoomIn={handleZoomIn} onZoomOut={handleZoomOut}
        />
        <PointsRenderer
          points={points} clickPoint={clickPoint} newPoint={newPointCoord}
        />
        <TileLayer
          attribution="" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEventsHandler
          syncZoom={syncZoom} canPickCoordinates={isModalOpen} onPickCoordinates={selectCoordinates} shouldIgnoreDoubleClick={shouldIgnoreDoubleClick}
        />
        <PointHandler
          isOpen={isModalOpen} onClose={resetEditor} onChangeCoordinates={startCoordinatePicking} onChangeDetails={updateDraftField}
          updateCoordinates={updateCoordinates} onDelete={handleDeletePoint} onConfirm={handleSavePoint} selectedPoint={selectedPoint}
        />
      </MapContainer>
      {
        !isPickingCoordinates
          ? <SidebarProvider points={points} clickPoint={clickPoint} onCreatePoint={openCreatePoint} />
          : null
      }
    </>
  );
}
