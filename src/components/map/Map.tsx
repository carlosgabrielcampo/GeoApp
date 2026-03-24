"use client";


import dynamic from "next/dynamic";
import LoadingScreen from "./LoadingScreen";

const DynamicMap = dynamic(() => import("./DynamicMap"), {
  ssr: false,
  loading: () => <LoadingScreen message="Preparing the map..." />,
});

export default function Map() {
  return <DynamicMap />;
}
