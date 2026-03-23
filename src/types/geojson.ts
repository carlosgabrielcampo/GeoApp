export type FormatType = "Feature"
type GeometryTypes = "Point"

interface Geometry {
    "type": GeometryTypes,
    "coordinates": [number, number] | [number, number, number]
}

interface Properties {
    "name": string,
    "description": string
}

export interface DataFormat {
    "type": FormatType,
    "geometry": Geometry,
    "properties": Properties
}

