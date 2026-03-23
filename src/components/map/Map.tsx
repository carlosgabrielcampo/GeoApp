"use client";


import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./DynamicMap"), {
  ssr: false,
  loading: () => <p>A map is loading</p>,
});

export default function Map() {
  return <DynamicMap />;
}