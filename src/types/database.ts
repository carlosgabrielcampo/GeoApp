import { DataFormat } from "./geojson";

export type DatabaseFormat = Record<string, DataFormat>;

export type ApiMessage = {
  message: string;
};
