import {
  DataFormat,
  FeatureCollection,
  GeoJsonCoordinates,
} from "@/types/geojson";

const GEOJSON_API = "/api/geojson";

export type ApiMessage = {
  message: string;
};

type CreateFeatureInput = {
  coordinates: GeoJsonCoordinates;
  name?: string;
  description?: string;
};

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = (await response.json()) as T | ApiMessage;

  if (!response.ok) {
    throw new Error(
      typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string"
        ? data.message
        : `Request failed with status ${response.status}`
    );
  }

  return data as T;
}

export function getAllFeatures() {
  return request<FeatureCollection>(GEOJSON_API);
}

export function getFeatureById(id: string) {
  return request<DataFormat>(`${GEOJSON_API}/${id}`);
}

export function createFeature({
  coordinates,
  name = "",
  description = "",
}: CreateFeatureInput) {
  const feature: DataFormat = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates,
    },
    properties: {
      name,
      description,
    },
  };

  return request<DataFormat>(GEOJSON_API, {
    method: "POST",
    body: JSON.stringify(feature),
  });
}

export function updateFeature(id: string, feature: DataFormat) {
  return request<DataFormat>(`${GEOJSON_API}/${id}`, {
    method: "PUT",
    body: JSON.stringify(feature),
  });
}

export function deleteFeature(id: string) {
  return request<void>(`${GEOJSON_API}/${id}`, {
    method: "DELETE",
  });
}
