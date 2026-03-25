import { ZoomIn, ZoomOut } from "lucide-react";
import { Dispatch, SetStateAction } from "react";


export function ZoomHandler({ setZoom }: { setZoom: Dispatch<SetStateAction<number>> }) {
  return (
    <div className="pointer-events-auto absolute right-4 bottom-4 z-[400] gap-2 flex max-h-[calc(100vh-2rem)]">
      <button
        type="button"
        onClick={() => setZoom((prev) => prev + 1)}
        className="mt-4 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:bg-slate-50"
      >
        <ZoomIn size={20} />
      </button>
      <button
        type="button"
        onClick={() => setZoom((prev) => prev - 1)}
        className="mt-4 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:bg-slate-50"
      >
        <ZoomOut size={20} />
      </button>
    </div>
  );
}
