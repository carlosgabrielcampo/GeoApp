"use client";

import { DataFormat } from "@/types/geojson";
import { EditablePoint, PointSelection } from "@/types/points";
import { MapPinned, ChevronLeft, ChevronRight, Plus, ZoomIn } from "lucide-react"
import Image from "next/image"
import { Dispatch, SetStateAction, useState } from "react";

type SidebarProviderProps = {
    points: [string, DataFormat][];
    sidebarIconSrc: string;
    clickPoint: (selected: PointSelection) => void;
    setIsPickingCoordinates: (value: boolean) => void;
    setSelectedPoint: Dispatch<SetStateAction<EditablePoint | null>>;
    defaultPoint: EditablePoint;
};

export default function SidebarProvider({
    points,
    sidebarIconSrc,
    clickPoint,
    setIsPickingCoordinates,
    setSelectedPoint,
    defaultPoint
}: SidebarProviderProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const openCreatePoint = () => {
        setIsPickingCoordinates(false);
        setSelectedPoint({
            ...defaultPoint,
            properties: {
                ...defaultPoint.properties,
            },
            geometry: {
                ...defaultPoint.geometry,
            },
        });
    };
    return (
        <aside className="pointer-events-auto absolute left-4 top-4 z-[400] flex max-h-[calc(100vh-2rem)]">
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
                                {
                                    points.map(([id, point]: [id: string, point: DataFormat]) => (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => clickPoint({ id, ...point })}
                                            className="flex w-full items-start gap-3 rounded-2xl border border-transparent px-3 py-3 text-left transition hover:border-slate-400 hover:bg-slate-50"
                                        >
                                            <Image
                                                src={sidebarIconSrc}
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
                                    ))
                                }
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
    )
}
