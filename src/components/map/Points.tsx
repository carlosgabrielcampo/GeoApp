import Image from "next/image";
import { Marker, useMap, useMapEvents } from "react-leaflet"
import FeatureIcon from '@/assets/icons/pino-de-localizacao.ico'
import L, { Icon, IconOptions } from 'leaflet'
import { EditablePoint, PointsProps, PointInterface } from "@/types/points"
import { DataFormat } from "@/types/geojson"
import PointInsert from "../modal/pointInsert"
import { useEffect, useState } from "react"
import { createFeature, deleteFeature, updateFeature } from "@/services/dbHandler"
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight, MapPinned, Plus } from "lucide-react";

type SelectedPoint = EditablePoint | null;

const EMPTY_POINT: EditablePoint = {
    type: "Feature",
    geometry: {
        type: "Point",
    },
    properties: {
        name: "",
        description: "",
    },
};

export default function PointsRenderer({ points, load }: PointsProps) {
    const [selectedPoint, setSelectedPoint] = useState<SelectedPoint>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isPickingCoordinates, setIsPickingCoordinates] = useState(false);
    const isModalOpen = Boolean(selectedPoint) && !isPickingCoordinates;

    const iconByType: Record<DataFormat["type"], Icon<IconOptions>> = {
    Feature: L.icon({
        iconUrl: FeatureIcon.src ?? FeatureIcon,
        iconSize: [32, 32],
    }),
    };

    const openCreatePoint = () => {
        setIsPickingCoordinates(false);
        setSelectedPoint({
            ...EMPTY_POINT,
            properties: {
                ...EMPTY_POINT.properties,
            },
            geometry: {
                ...EMPTY_POINT.geometry,
            },
        });
    };

    const deletePoint = async (id: string) => {
        try {
            await deleteFeature(id);
            setSelectedPoint(null);
            setIsPickingCoordinates(false);
            await load();
            toast.success("Point deleted successfully.");
        } catch (error) {
            console.error("Failed to delete point", error);
            toast.error("Failed to delete point.");
        }
    };

    const savePoint = async (feature: DataFormat) => {
        try {
            if (selectedPoint?.id) {
                await updateFeature(selectedPoint.id, feature);
                toast.success("Point updated successfully.");
            } else {
                await createFeature({
                    coordinates: feature.geometry.coordinates,
                    name: feature.properties.name,
                    description: feature.properties.description,
                });
                toast.success("Point created successfully.");
            }

            setSelectedPoint(null);
            setIsPickingCoordinates(false);
            await load();
        } catch (error) {
            console.error("Failed to save point", error);
            toast.error("Failed to save point.");
        }
    };

    const clickPoint = (selected: { id: string } & DataFormat) => {
        setIsPickingCoordinates(false);
        setSelectedPoint(selected)
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

    
    return <>
        <MapInteractionLock isLocked={isModalOpen} />
        <PointPlacementHandler
            isPickingCoordinates={isPickingCoordinates}
            onPickCoordinates={(coordinates) => {
                setSelectedPoint((currentPoint) => ({
                    ...(currentPoint ?? {
                        ...EMPTY_POINT,
                        properties: {
                            ...EMPTY_POINT.properties,
                        },
                        geometry: {
                            ...EMPTY_POINT.geometry,
                        },
                    }),
                    geometry: {
                        type: "Point",
                        coordinates,
                    },
                }));
                setIsPickingCoordinates(false);
                toast.success("Coordinates selected.");
            }}
        />
        <aside className="pointer-events-auto absolute left-4 top-4 z-[900] flex max-h-[calc(100vh-2rem)]">
            <button
                type="button"
                onClick={() => setIsSidebarOpen((value) => !value)}
                className="mt-4 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:bg-slate-50"
                aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
                {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>

            {isSidebarOpen ? (
                <div className="ml-3 flex w-[340px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur">
                    <div className="border-b border-slate-200 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-slate-900 p-2 text-white">
                                <MapPinned size={18} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Points</h2>
                                <p className="text-sm text-slate-500">
                                    {points.length} mapped location{points.length === 1 ? "" : "s"}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={openCreatePoint}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                        >
                            <Plus size={18} />
                            Create new point
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-3 py-3">
                        {points.length ? (
                            <div className="space-y-2">
                                {points.map(([id, point]) => (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => clickPoint({ id, ...point })}
                                        className="flex w-full items-start gap-3 rounded-2xl border border-transparent px-3 py-3 text-left transition hover:border-slate-200 hover:bg-slate-50"
                                    >
                                        <Image
                                            src={FeatureIcon.src ?? FeatureIcon}
                                            alt=""
                                            width={32}
                                            height={32}
                                            className="mt-0.5 h-8 w-8 shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                {point.properties.name || "Untitled point"}
                                            </p>
                                            <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                                                {point.properties.description || "No description yet."}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                                No points yet. Create one from the button above.
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </aside>
        {
            points?.length && points
                .map(([keyValue, { properties, type, geometry }]) => {
                    return (
                        <Point
                            key={keyValue}
                            coordinates={geometry.coordinates}
                            icon={iconByType[type]}
                            name={properties.name}
                            description={properties.description}
                            eventHandlers={{ click: () => clickPoint({id: keyValue, properties, type, geometry}) }}
                        />
                    )
                })
        }
        {
            <PointInsert
                selectedPoint={selectedPoint}
                isOpen={isModalOpen} 
                isPickingCoordinates={isPickingCoordinates}
                onClose={() => {
                    setIsPickingCoordinates(false);
                    setSelectedPoint(null)
                }}
                onChangeDetails={updateDraftField}
                onConfirm={(feature) => {
                    void savePoint(feature);
                }}
                onChangeCoordinates={startCoordinatePicking}
                onDelete={() => {
                    if (!selectedPoint?.id) {
                        return;
                    }
                    void deletePoint(selectedPoint.id);
                }}
            />
        }
    </>
}


function Point({ coordinates, icon, eventHandlers }: PointInterface)
{
    return <Marker
        position={coordinates}
        icon={icon}
        eventHandlers={eventHandlers}
    >
    </Marker>

}

function PointPlacementHandler({
    isPickingCoordinates,
    onPickCoordinates,
}: {
    isPickingCoordinates: boolean;
    onPickCoordinates: (coordinates: [number, number]) => void;
}) {
    useMapEvents({
        dblclick(event) {
            if (!isPickingCoordinates) {
                return;
            }

            onPickCoordinates([event.latlng.lat, event.latlng.lng]);
        },
    });

    return null;
}

function MapInteractionLock({ isLocked }: { isLocked: boolean }) {
    const map = useMap();

    useEffect(() => {
        if (isLocked) {
            map.dragging.disable();
            map.scrollWheelZoom.disable();
            map.doubleClickZoom.disable();
            map.boxZoom.disable();
            map.keyboard.disable();

            if (map.tap) {
                map.tap.disable();
            }

            if (map.touchZoom) {
                map.touchZoom.disable();
            }
        } else {
            map.dragging.enable();
            map.scrollWheelZoom.enable();
            map.doubleClickZoom.disable();
            map.boxZoom.enable();
            map.keyboard.enable();

            if (map.tap) {
                map.tap.enable();
            }

            if (map.touchZoom) {
                map.touchZoom.enable();
            }
        }
    }, [isLocked, map]);

    return null;
}
