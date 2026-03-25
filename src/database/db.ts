import { DataFormat, FeatureCollection } from "@/types/geojson";
export type DatabaseFormat = Record<string, DataFormat>;


const features: DatabaseFormat = {
  "a557be5d-820c-408d-b96b-4cea113fca51": {
    id: "a557be5d-820c-408d-b96b-4cea113fca51",
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-49.36970930019219, -28.679780189620093],
    },
    properties: {
      name: "Exemplo de Ponto",
      description: "Este é um ponto de exemplo.",
    },
  },
};

export function getAllFeatures(): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: Object.values(features),
  };
}

export function getFeatureById(id: string) {
  return features[id] ?? null;
}

export function createFeature(id: string, feature: DataFormat) {
  if (features[id]) {
    return null;
  }

  const storedFeature: DataFormat = {
    ...feature,
    id,
  };

  features[id] = storedFeature;
  return storedFeature;
}

export function updateFeatureById(id: string, feature: DataFormat) {
  if (!features[id]) {
    return null;
  }

  const storedFeature: DataFormat = {
    ...feature,
    id,
  };

  features[id] = storedFeature;
  return storedFeature;
}

export function deleteFeatureById(id: string) {
  if (!features[id]) {
    return false;
  }

  delete features[id];
  return true;
}
