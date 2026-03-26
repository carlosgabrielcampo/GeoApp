import { DataFormat, LeafletCoordinates, toGeoJsonCoordinates, toLeafletCoordinates } from "@/types/geojson";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { EditablePoint, PointSelection } from "@/types/points";
import { toast } from "react-toastify";

type UsePointEditorParams = {
    defaultPoint: EditablePoint;
    setPosition: Dispatch<SetStateAction<LeafletCoordinates>>;
};

export function usePointEditor({ defaultPoint, setPosition }: UsePointEditorParams) {
    const [selectedPoint, setSelectedPoint] = useState<EditablePoint | null>(null);
    const [newPointCoord, setNewPointCoord] = useState<LeafletCoordinates | null>(null);
    const [isPickingCoordinates, setIsPickingCoordinates] = useState(false);

    const updateSelectedPoint = (
        updater: (currentPoint: EditablePoint) => EditablePoint
    ) => {
        setSelectedPoint((currentPoint) => {
            if (!currentPoint) {
                return currentPoint;
            }

            return updater(currentPoint);
        });
    };

    const resetEditor = () => {
        setIsPickingCoordinates(false);
        setSelectedPoint(null);
        setNewPointCoord(null);
    };

    const createDraftPoint = (): EditablePoint => ({
        ...defaultPoint,
        properties: {
            ...defaultPoint.properties,
        },
        geometry: {
            ...defaultPoint.geometry,
        },
    });

    const openCreatePoint = () => {
        setIsPickingCoordinates(false);
        setNewPointCoord(null);
        setSelectedPoint(createDraftPoint());
    };

    const startCoordinatePicking = () => {
        setIsPickingCoordinates(true);
        toast.info("Double click the map to choose coordinates.");
    };

    const updateDraftField = (field: "name" | "description", value: string) => {
        updateSelectedPoint((currentPoint) => ({
            ...currentPoint,
            properties: {
                ...currentPoint.properties,
                [field]: value,
            },
        }));
    };

    const updateCoordinates = (value: DataFormat["geometry"]["coordinates"]) => {
        updateSelectedPoint((currentPoint) => ({
            ...currentPoint,
            geometry: {
                ...currentPoint.geometry,
                coordinates: value,
            },
        }));
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
            ...(currentPoint ?? createDraftPoint()),
            geometry: {
                type: "Point",
                coordinates: geoJsonCoordinates,
            },
        }));
        setNewPointCoord(coordinates);
        setIsPickingCoordinates(false);
        setPosition(coordinates);
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
        selectedPoint,
        newPointCoord,
        openCreatePoint,
        updateDraftField,
        updateCoordinates,
        selectCoordinates,
        isPickingCoordinates,
        startCoordinatePicking,
    };
}
