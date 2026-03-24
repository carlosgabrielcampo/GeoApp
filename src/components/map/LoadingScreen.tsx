"use client";

type LoadingScreenProps = {
  message?: string;
};

export default function LoadingScreen({
  message = "Loading map data...",
}: LoadingScreenProps) {
  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-slate-950">
      <video
        autoPlay
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/loaders/world-map.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-slate-950/45" />

      <div className="h-32 w-86 bg-black-800/95 absolute top-[43%] backdrop-blur-xs"/>
      <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/25 border-t-white" />
          <p className="text-sm font-medium tracking-[0.3em] uppercase">
            {message}
          </p>
      </div>
    </div>
  );
}
