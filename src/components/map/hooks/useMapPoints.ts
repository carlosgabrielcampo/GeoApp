import { createFeature, deleteFeature, getAllFeatures, updateFeature } from "@/services/dbHandler";
import { DataFormat } from "@/types/geojson";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export function useMapPoints() {
    const [points, setPoints] = useState<DataFormat[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const load = useCallback(async () => {
        const data = await getAllFeatures();
        const filteredPoints = data.features.filter(
            (feature): feature is DataFormat => feature.geometry.type === "Point"
        );

        setPoints(filteredPoints);
    }, []);

    useEffect(() => {
        const loadPoints = async () => {
            try {
                setIsLoading(true);
                await load();
            } catch (error) {
                console.error(error);
                toast.error("Failed to load points.");
            } finally {
                setIsLoading(false);
            }
        };

        void loadPoints();
    }, [load]);

    const savePoint = async (feature: DataFormat, pointId?: string) => {
        try {
            if (feature.geometry.coordinates.some((value) => !Number.isFinite(value))) {
                toast.error("Coordinates not set.");
                return false;
            }

            if (pointId) {
                await updateFeature(pointId, feature);
                toast.success("Point updated successfully.");
            } else {
                await createFeature({
                    coordinates: feature.geometry.coordinates,
                    name: feature.properties.name,
                    description: feature.properties.description,
                });
                toast.success("Point created successfully.");
            }

            await load();
            return true;
        } catch (error) {
            console.error("Failed to save point", error);
            toast.error(error instanceof Error ? error.message : "Failed to save point.");
            return false;
        }
    };

    const deletePoint = async (id: string) => {
        try {
            await deleteFeature(id);
            await load();
            toast.success("Point deleted successfully.");
            return true;
        } catch (error) {
            console.error("Failed to delete point", error);
            toast.error(error instanceof Error ? error.message : "Failed to delete point.");
            return false;
        }
    };

    return {
        load,
        points,
        isLoading,
        savePoint,
        deletePoint,
    };
}
