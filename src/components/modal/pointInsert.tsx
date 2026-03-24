"use client";

import { DataFormat } from "@/types/geojson";
import { FormEvent, useEffect, useMemo } from "react";
import { PointInsertProps } from "@/types/points";
import { Copy, Trash2, X } from "lucide-react";


export default function PointInsert({
  selectedPoint,
  isOpen,
  isPickingCoordinates = false,
  onClose,
  onDelete,
  onChangeDetails,
  onConfirm,
  onChangeCoordinates,
}: PointInsertProps) {
  const isEditing = Boolean(selectedPoint?.id);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [isOpen]);

  const featurePreview = useMemo<DataFormat | null>(() => {
    if (!selectedPoint?.geometry?.coordinates) {
      return null;
    }

    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: selectedPoint?.geometry?.coordinates,
      },
      properties: {
        name: selectedPoint.properties.name.trim(),
        description: selectedPoint.properties.description.trim(),
      },
    };
  }, [selectedPoint]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!featurePreview) {
      return;
    }
    onConfirm(featurePreview);
  };

  return (
    <>
      <div className="absolute h-[100%] w-[100%] bg-white " />
      <div
        className="absolute left-[0] inset-0 z-[1000] flex  bg-black/40 p-4 touch-none"
      >
        <div className="flex  h-[100%] w-[400px] flex-col rounded-2xl bg-white p-6 shadow-2xl touch-auto">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {isEditing ? "Edit point" : "Create point"}
              </h2>
              <p className="text-sm text-slate-500">
                {isEditing
                  ? "Update the GeoJSON point feature."
                  : "Start a new GeoJSON point feature."}
              </p>
            </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 p-1 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <X size={16} />
              </button>
          </div>

          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm text-slate-700">
              Type
              <select
                value="Feature"
                disabled
                className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-slate-900"
              >
                <option value="Feature">Feature</option>
              </select>
            </label>

            <div className="flex flex-col gap-2 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Coordinates</span>

              </div>
              <div className="flex justify-center items-center gap-1">
                <div className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600">
                  {selectedPoint?.geometry?.coordinates ? `${selectedPoint?.geometry.coordinates[0]}` : "No coordinates selected"}
                </div>
                <div className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600">
                  {selectedPoint?.geometry?.coordinates ? `${selectedPoint?.geometry.coordinates[1]}` : "No coordinates selected"}
                </div>
                <div className="rounded-lg border border-slate-300  p-2 font-mono text-xs hover:bg-slate-50">
                  <Copy size={18} />
                </div>
              </div>
              <button
                type="button"
                onClick={onChangeCoordinates}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Pick on map
              </button>
            </div>

            <label className="flex flex-col gap-1 text-sm text-slate-700 ">
              <p>
                Name <span className="text-xs text-slate-400">(optional)</span>
              </p>
              <input
                value={selectedPoint?.properties.name || ""}
                onChange={(event) => onChangeDetails("name", event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500"
                placeholder="Exemplo de Ponto"
              />
            </label>

            <label className="flex min-h-0 flex-1 flex-col gap-1 text-sm text-slate-700">
              <p>
                Description <span className="text-xs text-slate-400">(optional)</span>
              </p>
              <textarea
                value={selectedPoint?.properties.description || ""}
                onChange={(event) => onChangeDetails("description", event.target.value)}
                className="min-h-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500"
                placeholder="Este e um ponto de exemplo."
              />
            </label>
            <div className="flex items-center justify-end gap-3 pt-2">
            {isEditing ? (
              <button
                type="button"
                onClick={onDelete}
                className="rounded-lg border bg-[#ef3840] text-white border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#ef3840]/90"
              >
                Delete
              </button>
            ) : null}
              <button
                type="submit"
                disabled={!selectedPoint?.geometry?.coordinates}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isEditing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
