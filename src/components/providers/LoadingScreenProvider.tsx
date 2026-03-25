"use client";

type LoadingScreenProps = {
  message?: string;
};

export default function LoadingScreenProvider({
  message = "Loading map data...",
}: LoadingScreenProps) {
  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-white-950">
      <div className="absolute inset-0 bg-white-950/45" />
      <div className="h-32 w-86 bg-white-800/95 absolute top-[43%] backdrop-blur-xs"/>
      <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center text-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-black/25 border-t-black" />
          <p className="text-sm font-medium tracking-[0.3em] uppercase">
            {message}
          </p>
      </div>
    </div>
  );
}
