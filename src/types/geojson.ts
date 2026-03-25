export type FeatureType = "Feature";
export type FeatureCollectionType = "FeatureCollection";
export type GeometryType = "Point";
export type GeoJsonCoordinates = [number, number];
export type LeafletCoordinates = [number, number];

export interface Geometry {
  type: GeometryType;
  coordinates: GeoJsonCoordinates;
}

export interface Properties {
  name: string;
  description: string;
}

export interface DataFormat {
  type: FeatureType;
  id?: string;
  geometry: Geometry;
  properties: Properties;
}

export interface FeatureCollection {
  type: FeatureCollectionType;
  features: DataFormat[];
}

type ValidationResult =
  | { valid: true; feature: DataFormat }
  | { valid: false; message: string };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function validateGeoJsonFeature(value: unknown): ValidationResult {
  if (!isObject(value)) {
    return { valid: false, message: "Body must be a JSON object." };
  }

  if (value.type !== "Feature") {
    return { valid: false, message: 'GeoJSON feature "type" must be "Feature".' };
  }

  if (!isObject(value.geometry)) {
    return { valid: false, message: 'GeoJSON feature must include a "geometry" object.' };
  }

  if (value.geometry.type !== "Point") {
    return { valid: false, message: 'Only "Point" geometry is supported.' };
  }

  const coordinates = value.geometry.coordinates;

  if (
    !Array.isArray(coordinates) ||
    coordinates.length !== 2 ||
    !isFiniteNumber(coordinates[0]) ||
    !isFiniteNumber(coordinates[1])
  ) {
    return {
      valid: false,
      message: 'Point coordinates must be a numeric tuple in the format [longitude, latitude].',
    };
  }

  const [longitude, latitude] = coordinates;

  if (longitude < -180 || longitude > 180) {
    return { valid: false, message: "Longitude must be between -180 and 180." };
  }

  if (latitude < -90 || latitude > 90) {
    return { valid: false, message: "Latitude must be between -90 and 90." };
  }

  if (!isObject(value.properties)) {
    return { valid: false, message: 'GeoJSON feature must include a "properties" object.' };
  }

  const properties = value.properties;

  if (typeof properties.name !== "string" || typeof properties.description !== "string") {
    return {
      valid: false,
      message: '"properties.name" and "properties.description" must be strings.',
    };
  }

  return {
    valid: true,
    feature: {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      properties: {
        name: properties.name,
        description: properties.description,
      },
    },
  };
}

export function toLeafletCoordinates(
  coordinates: GeoJsonCoordinates
): LeafletCoordinates {
  return [coordinates[1], coordinates[0]];
}

export function toGeoJsonCoordinates(
  coordinates: LeafletCoordinates
): GeoJsonCoordinates {
  return [coordinates[1], coordinates[0]];
}
