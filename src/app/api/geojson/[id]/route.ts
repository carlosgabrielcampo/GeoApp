import {
  deleteFeatureById,
  getFeatureById,
  updateFeatureById,
} from "@/database/db";
import { validateGeoJsonFeature } from "@/types/geojson";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Id not informed." }, { status: 400 });
    }

    const feature = getFeatureById(id);

    if (!feature) {
      return NextResponse.json({ message: "Register not found." }, { status: 404 });
    }

    return NextResponse.json(feature, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Failed to get feature." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Id not informed." }, { status: 400 });
    }

    const body = await request.json();
    const validation = validateGeoJsonFeature(body);

    if (!validation.valid) {
      return NextResponse.json({ message: validation.message }, { status: 400 });
    }

    const feature = updateFeatureById(id, validation.feature);

    if (!feature) {
      return NextResponse.json({ message: "Register not found." }, { status: 404 });
    }

    return NextResponse.json(feature, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Failed to update feature." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Id not informed." }, { status: 400 });
    }

    const deleted = deleteFeatureById(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Register does not exist." },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete feature." },
      { status: 500 }
    );
  }
}
