import { GetById, Put, DeleteById } from "@/database/db";
import { DataFormat } from "@/types/geojson";
import { NextResponse } from "next/server";
export async function GETBYID({
    params
}: {
    params: Promise<{ id: string }>
}) {
    try {
        const { id } = await params;
        return NextResponse.json(GetById(id));
    } catch {
        return NextResponse.json(
            { error: "Failed to get features" },
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
        const body = await request.json();
        if (!body.type || !body.geometry || !body.properties) {
            return NextResponse.json(
                { error: "Invalid JSON format" },
                { status: 400 }
            );
        }
        const updatedFeature: DataFormat = {
            type: body.type,
            geometry: body.geometry,
            properties: body.properties,
        };
        return NextResponse.json(Put(id, updatedFeature));
    } catch {
        return NextResponse.json(
            { error: "Failed to update feature" },
            { status: 500 }
        );
    }
}

export async function DELETEBYID(
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        return NextResponse.json(DeleteById(id));
    } catch {
        return NextResponse.json(
            { error: "Failed to delete feature" },
            { status: 500 }
        );
    }
}