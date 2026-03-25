import { ZoomIn, ZoomOut } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

export function ZoomHandler({
  setZoom,
  setZoomPressed,
}: {
  setZoom: Dispatch<SetStateAction<number>>;
  setZoomPressed: Dispatch<SetStateAction<boolean>>;
}) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const pulseZoomPressed = () => {
    setZoomPressed(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setZoomPressed(false);
      timeoutRef.current = null;
    }, 100);
  };

  return (
    <div className="pointer-events-auto absolute right-4 bottom-4 z-[400] gap-2 flex max-h-[calc(100vh-2rem)]">
      <button
        type="button"
        onClick={() => {
          setZoom((prev) => prev + 1);
          pulseZoomPressed();
        }}
        className="mt-4 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:bg-slate-50"
      >
        <ZoomIn size={20} />
      </button>
      <button
        type="button"
        onClick={() => {
          setZoom((prev) => prev - 1);
          pulseZoomPressed();
        }}
        className="mt-4 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:bg-slate-50"
      >
        <ZoomOut size={20} />
      </button>
    </div>
  );
}
