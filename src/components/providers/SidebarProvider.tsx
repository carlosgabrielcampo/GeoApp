"use client";

import { DataFormat } from "@/types/geojson";
import { EditablePoint, PointSelection } from "@/types/points";
import { ChevronLeft, ChevronRight, MapPinned, Plus } from "lucide-react";
import Image from "next/image";
import { Dispatch, MouseEventHandler, SetStateAction, useState } from "react";
import { Button, Text } from "../ui";

type SidebarProviderProps = {
  points: DataFormat[];
  sidebarIconSrc: string;
  clickPoint: (selected: PointSelection) => void;
  setIsPickingCoordinates: (value: boolean) => void;
  setSelectedPoint: Dispatch<SetStateAction<EditablePoint | null>>;
  defaultPoint: EditablePoint;
};

type SidebarItemsProps = {
  onclick: MouseEventHandler;
  iconSrc: string;
  name: string;
  description: string;
};

export default function SidebarProvider({
  points,
  sidebarIconSrc,
  clickPoint,
  setIsPickingCoordinates,
  setSelectedPoint,
  defaultPoint,
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
      <Button
        type="button"
        onclick={() => setIsSidebarOpen((value) => !value)}
        styleType="round"
      >
        {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </Button>
      {isSidebarOpen ? (
        <div className="ml-3 flex w-[340px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur">
          <div className="flex flex-col border-b border-slate-200 px-5 py-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-900 p-2 text-white">
                <MapPinned size={18} />
              </div>
              <div>
                <Text value="Points" styleType="title" />
                <Text
                  value={`${points.length} mapped location${points.length === 1 ? "" : "s"}`}
                  styleType="subtitle"
                />
              </div>
            </div>
            <Button
              type="button"
              onclick={openCreatePoint}
              styleType="action"
              width="100%"
            >
              <>
                <Plus size={18} />
                <p>Create new point</p>
              </>
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-3">
            {points.length ? (
              <div className="space-y-2">
                {points.map((point) => {
                  if (!point.id) {
                    return null;
                  }

                  const pointId = point.id;

                  return (
                    <SidebarItem
                      key={pointId}
                      onclick={() => clickPoint({ ...point, id: pointId })}
                      iconSrc={sidebarIconSrc}
                      name={point.properties.name || "Untitled point"}
                      description={point.properties.description || "No description yet."}
                    />
                  );
                })}
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
  );
}

export function SidebarItem({ onclick, iconSrc, name, description }: SidebarItemsProps) {
  return (
    <button
      type="button"
      onClick={onclick}
      className="flex w-full items-start gap-3 rounded-2xl border border-transparent px-3 py-3 text-left transition hover:border-slate-400 hover:bg-slate-50"
    >
      <Image
        src={iconSrc}
        alt=""
        width={32}
        height={32}
        className="mt-0.5 h-8 w-8 shrink-0"
      />
      <div className="min-w-0">
        <Text value={name} styleType="default" />
        <Text value={description} styleType="sm-muted" />
      </div>
    </button>
  );
}
