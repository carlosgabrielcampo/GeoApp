import { createFeature, getAllFeatures } from "@/database/db";
import { validateGeoJsonFeature } from "@/types/geojson";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function GET() {
  try {
    return NextResponse.json(getAllFeatures(), { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Failed to get all features." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateGeoJsonFeature(body);

    if (!validation.valid) {
      return NextResponse.json({ message: validation.message }, { status: 400 });
    }

    const feature = createFeature(uuid(), validation.feature);

    if (!feature) {
      return NextResponse.json(
        { message: "Failed to create feature because the id already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(feature, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Failed to create feature." },
      { status: 500 }
    );
  }
}
