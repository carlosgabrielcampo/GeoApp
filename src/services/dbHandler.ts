import { DataFormat } from "@/types/geojson";
import { ApiEnvelope } from "@/types/database";

const GEOJSON_API = "/api/geojson";
type CreateFeatureInput = {
  coordinates: [number, number];
  name?: string;
  description?: string;
};

async function request<T>(input: string, init?: RequestInit): Promise<ApiEnvelope<T>> {
  const response = await fetch(input, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const data = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok) {
    throw new Error(
      "json" in data && data.json && typeof data.json === "object" && "message" in data.json
        ? data.json.message
        : `Request failed with status ${response.status}`
    );
  }

  return data;
}

export function getAllFeatures() {
  return request<Record<string, DataFormat>>(GEOJSON_API);
}

export function getFeatureById(id: string) {
  return request<DataFormat>(`${GEOJSON_API}/${id}`);
}

export function createFeature(
  { coordinates, name = "", description = "" }: CreateFeatureInput
) {
  const feature = {
    type: 'Feature',
    geometry: {
      type: "Point",
      coordinates,
    },
    properties: {
      name: name || '' ,
      description: description || '',
    },
  }
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
  return request<{ message: string }>(`${GEOJSON_API}/${id}`, {
    method: "DELETE",
  });
}
