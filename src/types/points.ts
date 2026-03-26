import { DivIcon, Icon, IconOptions } from "leaflet";
import { DataFormat, GeoJsonCoordinates, LeafletCoordinates } from "./geojson";

export type EditablePoint = {
  id?: string;
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates?: GeoJsonCoordinates;
  };
  properties: {
    name: string;
    description: string;
  };
};

export type PointSelection = { id: string } & DataFormat;

export type PointsProps = {
  points: DataFormat[];
  clickPoint: (selected: PointSelection) => void;
  newPoint?: LeafletCoordinates | null;
};

export interface PointInterface {
  key?: string;
  keyValue?: string;
  coordinates: LeafletCoordinates;
  name?: string;
  description?: string;
  icon: Icon<IconOptions> | DivIcon | undefined;
  eventHandlers?: {
    dblclick?: () => void;
    click?: () => void;
  };
}

export type PointInsertProps = {
  selectedPoint: EditablePoint | null;
  isOpen: boolean;
  isPickingCoordinates?: boolean;
  onClose: () => void;
  onDelete: () => void;
  onConfirm: (feature: DataFormat) => void;
  onChangeCoordinates: () => void;
  updateCoordinates: (value: GeoJsonCoordinates) => void;
  onChangeDetails: (field: "name" | "description", value: string) => void;
};

export type SidebarProviderProps = {
  points: DataFormat[];
  onCreatePoint: () => void;
  clickPoint: (selected: PointSelection) => void;
};
