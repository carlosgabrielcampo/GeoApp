import { DataFormat } from "@/types/geojson";
import { DatabaseFormat } from "@/types/database";

export interface GetByIdReturn {
    status: number, json: DataFormat | { message: string },
}

export interface GetAllReturn {
    status: number;
    json: DatabaseFormat | { message: string };
}

const features: DatabaseFormat = {
    "a557be5d-820c-408d-b96b-4cea113fca51": {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-47.8825, -15.7942]
    },
    "properties": {
        "name": "Exemplo de Ponto",
        "description": "Este é um ponto de exemplo."
    }
    }
};

const IdCheck = ( id: string ) => {
    if (!id) {
        return {
            status: 400,
            json: { message: "Id not informed" },
        };
    }
}

export const GetById = ( id: string ): GetByIdReturn => {
    try {
        const idCheck = IdCheck(id)
        if (idCheck) {
            return idCheck;
        }
        if (!features[id]) {
            return {
                status: 404,
                json: { message: "Register not found" }
            }
        }
        return { status: 200, json: features[id] }
    } catch (error) {
        return {
            status: 500,
            json: {
                message: error instanceof Error ? error.message : "Unknown error"
            },
        };
    }
}

export const GetAll = (): GetAllReturn => {
    try {
        return {
            status: 200,
            json: features
        }
    } catch (error) {
        return {
            status: 500,
            json: {
                message: error instanceof Error ? error.message : "Unknown error",
            }
        };
    }
}

export const Post = ( id: string, body: DataFormat ): GetByIdReturn => {
    try {
        const idCheck = IdCheck(id)
        if (idCheck) {
            return idCheck;
        }
        if (features[id]) {
            return {
                status: 409,
                json: { message: "Register already exists" },
            };
        }
        features[id] = body;
        return {
            status: 201,
            json: features[id],
        };
    } catch (error) {
        return {
            status: 500,
            json: {
                message: error instanceof Error ? error.message : "Unknown error",
            },
        };
    }

};

export const Put = ( id: string, body: DataFormat ): GetByIdReturn => {
    try {
        const idCheck = IdCheck(id)
        if (idCheck) {
            return idCheck;
        }
        features[id] = body;
        if (!features[id]) {
            return {
                status: 201,
                json: features[id],
            };
        } else {
            return {
                status: 200,
                json: features[id],
            };
        }

    } catch (error) {
        return {
            status: 500,
            json: {
                message: error instanceof Error ? error.message : "Unknown error",
            },
        };
    }
}

export const DeleteById = ( id: string ) => {
    try {
        const idCheck = IdCheck(id)
        if (idCheck) {
            return idCheck;
        }
        if (!features[id]) {
            return {
                status: 400,
                json: 'Register does not exist',
            };
        } else {
            return {
                status: 204,
                json: {
                    message: 'Register deleted'
                }
            };
        }
    } catch (error) {
        return {
            status: 500,
            json: {
                message: error instanceof Error ? error.message : "Unknown error",
            },
        };
    }
}