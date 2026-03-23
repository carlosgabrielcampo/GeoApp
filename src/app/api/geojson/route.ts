import { GetAll, Post } from "@/database/db";
import { DataFormat } from "@/types/geojson";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function GET() {
    try {
        return NextResponse.json(GetAll());
    } catch {
        return NextResponse.json(
            { error: "Failed to get all features" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        if (!body.type || !body.geometry || !body.properties) {
            return NextResponse.json(
                { error: "Invalid JSON format" },
                { status: 400 }
            );
        }
        const newFeature: DataFormat = {
            type: body.type,
            geometry: body.geometry,
            properties: body.properties,
        };
        const id = uuid()
        return NextResponse.json(Post(id, newFeature));
    } catch {
        return NextResponse.json(
            { error: "Failed to create feature" },
            { status: 500 }
        );
    }
}