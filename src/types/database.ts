import { DataFormat } from "./geojson"

export type DatabaseFormat = Record<string, DataFormat>

export interface RequestReturn {
    status: number, json: DataFormat | DatabaseFormat | { message: string },
}

export type ApiMessage = {
  message: string;
};

export type ApiEnvelope<T> = {
  status: number;
  json: T | ApiMessage;
};