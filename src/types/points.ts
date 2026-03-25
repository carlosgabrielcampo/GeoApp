import { IconOptions, DivIcon, Icon } from "leaflet";
import { DataFormat } from "./geojson";

export type EditablePoint = {
  id?: string;
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates?: [number, number];
  };
  properties: {
    name: string;
    description: string;
  };
};

export type PointSelection = { id: string } & DataFormat;

export type PointsProps = {
  points: [string, DataFormat][];
  iconByType: Record<DataFormat["type"], Icon<IconOptions>>;
  clickPoint: (selected: PointSelection) => void;
  newPoint?: [number, number] | null;
};

export interface PointInterface {
  key?: string,
  keyValue?: string,
  coordinates: [number, number],
  name?: string,
  description?: string,
  icon: Icon<IconOptions> | DivIcon | undefined
  eventHandlers?: {
    dblclick?: () => void;
    click?: () => void;
  }
}

export type PointInsertProps = {
  selectedPoint: EditablePoint | null;
  isOpen: boolean;
  isPickingCoordinates?: boolean;
  onClose: () => void;
  onDelete: () => void;
  onConfirm: (feature: DataFormat) => void;
  onChangeCoordinates: () => void;
  updateCoordinates: (value: [number, number]) => void;
  onChangeDetails: (field: "name" | "description", value: string) => void;
};
