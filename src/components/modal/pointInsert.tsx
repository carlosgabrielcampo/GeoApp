"use client";
import { DataFormat } from "@/types/geojson";
import { FormEvent, useEffect, useMemo } from "react";
import { PointInsertProps } from "@/types/points";
import { Copy, X } from "lucide-react";
import { copyToclipboard } from "@/util/navigation";
import { TextArea, Button, Input, Select, Label, Text } from "../ui";

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
            <Text
              value={isEditing ? "Edit point" : "Create point"}
              styleType="title"
            />
            <Text
              value={isEditing ? "Update the GeoJSON point." : "Create a new GeoJSON point."}
              styleType="subtitle"
            />
          </div>
          <Button
            onclick={onClose}
            styleType="default"
            disabled={!selectedPoint?.geometry?.coordinates}
            type="submit"
          >
            <X size={16} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-4">
          <Label value={<p>Type</p>} styleType="default" />
          <Select options={['Feature']} disabled />

          <div className="flex flex-col gap-2 text-sm text-slate-700 w-[100%]">
            <Label value={<p>Coordinates</p>} styleType="default" />
            <div className="flex justify-center items-center gap-1 ]">
              <Input
                styleType="default"
                type={"number"}
                width={"44%"}
                onchange={({ target: { value } }) => updateCoordinates([Number(value), Number(coordinates?.[1])])}
                value={coordinates ? `${coordinates[0]}` : "No coordinates selected"}
              />
              <Input
                styleType="default"
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
            type="text"
            value={selectedPoint?.properties.name || ""}
            styleType="default"
            onchange={(event) => onChangeDetails("name", event.target.value)}
            placeholder={"!xemple point"}
          />
          <Label
            value={<p>Description <span className="text-xs text-slate-400">(optional)</span></p>}
            styleType="default"
          />
          <TextArea
            value={selectedPoint?.properties.description || ''}
            styleType={'default'}
            onchange={(event) => onChangeDetails("description", event.target.value)}
            placeholder={"This is an exemple point"}
          />
          <div className="flex items-center justify-end gap-3 pt-2">
            {isEditing ? (
              <Button
                onclick={onDelete}
                styleType="warning"
                type="button"
              >
                <p>Delete</p>
              </Button>
            ) : null}
            <Button
              disabled={!selectedPoint?.geometry?.coordinates}
              styleType="action"
              type="submit"
            >
              {isEditing ? <p>Update</p> : <p>Create</p>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

