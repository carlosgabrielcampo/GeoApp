import L, { Icon, IconOptions } from "leaflet";
import FeatureIcon from "@/assets/icons/pino-de-localizacao.ico";
import { DataFormat } from "@/types/geojson";
import { EditablePoint } from "@/types/points";

export const iconByType: Record<DataFormat["type"], Icon<IconOptions>> = {
  Feature: L.icon({
    iconUrl: FeatureIcon.src ?? FeatureIcon,
    iconSize: [32, 32],
  }),
};

export const emptyPoint: EditablePoint = {
  type: "Feature",
  geometry: { type: "Point" },
  properties: { name: "", description: "" },
};