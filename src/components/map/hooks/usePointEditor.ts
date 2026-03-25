import { DataFormat, LeafletCoordinates, toGeoJsonCoordinates, toLeafletCoordinates } from "@/types/geojson";
import { EditablePoint, PointSelection } from "@/types/points";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { toast } from "react-toastify";

type UsePointEditorParams = {
    defaultPoint: EditablePoint;
    setPosition: Dispatch<SetStateAction<LeafletCoordinates>>;
};

export function usePointEditor({ defaultPoint, setPosition }: UsePointEditorParams) {
    const [selectedPoint, setSelectedPoint] = useState<EditablePoint | null>(null);
    const [newPointCoord, setNewPointCoord] = useState<LeafletCoordinates | null>(null);
    const [isPickingCoordinates, setIsPickingCoordinates] = useState(false);

    const resetEditor = () => {
        setIsPickingCoordinates(false);
        setSelectedPoint(null);
        setNewPointCoord(null);
    };

    const startCoordinatePicking = () => {
        setIsPickingCoordinates(true);
        toast.info("Double click the map to choose coordinates.");
    };

    const updateDraftField = (field: "name" | "description", value: string) => {
        setSelectedPoint((currentPoint) => {
            if (!currentPoint) {
                return currentPoint;
            }

            return {
                ...currentPoint,
                properties: {
                    ...currentPoint.properties,
                    [field]: value,
                },
            };
        });
    };

    const updateCoordinates = (value: DataFormat["geometry"]["coordinates"]) => {
        setSelectedPoint((currentPoint) => {
            if (!currentPoint) {
                return currentPoint;
            }

            return {
                ...currentPoint,
                geometry: {
                    ...currentPoint.geometry,
                    coordinates: value,
                },
            };
        });
    };

    const clickPoint = (selected: PointSelection) => {
        setIsPickingCoordinates(false);
        setNewPointCoord(null);
        setPosition(toLeafletCoordinates(selected.geometry.coordinates));
        setSelectedPoint(selected);
    };

    const selectCoordinates = (coordinates: LeafletCoordinates) => {
        const geoJsonCoordinates = toGeoJsonCoordinates(coordinates);

        setSelectedPoint((currentPoint) => ({
            ...(currentPoint ?? { ...defaultPoint }),
            geometry: {
                type: "Point",
                coordinates: geoJsonCoordinates,
            },
        }));
        setNewPointCoord(coordinates);
        setIsPickingCoordinates(false);
        toast.success("Coordinates selected.");
    };

    const isModalOpen = useMemo(
        () => Boolean(selectedPoint) && !isPickingCoordinates,
        [selectedPoint, isPickingCoordinates]
    );

    return {
        clickPoint,
        resetEditor,
        isModalOpen,
        newPointCoord,
        selectedPoint,
        setSelectedPoint,
        updateDraftField,
        updateCoordinates,
        selectCoordinates,
        isPickingCoordinates,
        startCoordinatePicking,
        setIsPickingCoordinates,
    };
}
