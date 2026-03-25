"use client";
import { DataFormat } from "@/types/geojson";
import { FormEvent, useEffect, useMemo } from "react";
import { PointInsertProps } from "@/types/points";
import { Copy, X } from "lucide-react";
import { copyToclipboard } from "@/util/navigation";
import { TextArea, Button, Input, Select, Label } from "../ui";

export default function PointInsert({
  selectedPoint,
  isOpen,
  onClose,
  onDelete,
  onConfirm,
  onChangeDetails,
  updateCoordinates,
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

  const coordinates = selectedPoint?.geometry.coordinates

  return (
    <div
      className="absolute left-[0] inset-0 z-[500] flex  bg-black/40 p-4 touch-none"
    >
      <div className="flex  h-[100%] w-[400px] flex-col rounded-2xl bg-white p-6 shadow-2xl touch-auto">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEditing ? "Edit point" : "Create point"}
            </h2>
            <p className="text-sm text-slate-500">
              {isEditing
                ? "Update the GeoJSON point."
                : "Create a new GeoJSON point."}
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
          <Label value={<p>Type</p>} styleType="default" />
          <Select options={['Feature']} disabled />

          <div className="flex flex-col gap-2 text-sm text-slate-700 w-[100%]">
            <Label value={<p>Coordinates</p>} styleType="default" />
            <div className="flex justify-center items-center gap-1 ]">
              <Input
                type={"number"}
                width={"44%"}
                onchange={({ target: { value } }) => updateCoordinates([Number(value), Number(coordinates?.[1])])}
                value={coordinates ? `${coordinates[0]}` : "No coordinates selected"}
              />
              <Input
                type={"number"}
                width={"44%"}
                onchange={({ target: { value } }) => updateCoordinates([Number(coordinates?.[0]), Number(value)])}
                value={coordinates ? `${coordinates[1]}` : "No coordinates selected"}
              />
              <Button
                onclick={() => copyToclipboard(coordinates ? `${coordinates[0]},${coordinates[1]}` : '')}
                styleType="default"
                type="button"
                width="w-[10%]"
              >
                <Copy size={18} />
              </Button>
            </div>
            <Button
              onclick={onChangeCoordinates}
              styleType="default"
              type="button"
              width="w-[10%]"
            >
              <p>Pick on map</p>
            </Button>
          </div>
          <Label
            value={<p>Name <span className="text-xs text-slate-400">(optional)</span></p>}
            styleType="default"
          />
          <Input
            type={"number"}
            onchange={({ target: { value } }) => updateCoordinates([Number(coordinates?.[0]), Number(value)])}
            value={selectedPoint?.properties.name || ""}
            placeholder={"Exemplo de Ponto"}
          />
          <Label
            value={<p>Description <span className="text-xs text-slate-400">(optional)</span></p>}
            styleType="default"
          />
          <TextArea
            value={selectedPoint?.properties.description || ''}
            styleType={'default'}
            onchange={(event) => onChangeDetails("description", event.target.value)}
            placeholder={"Este e um ponto de exemplo."}
          />
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
  );
}

