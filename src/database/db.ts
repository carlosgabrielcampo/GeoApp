import { DataFormat } from "@/types/geojson";
import { DatabaseFormat } from "@/types/database";
import { RequestReturn } from "@/types/database";

const features: DatabaseFormat = {
    "a557be5d-820c-408d-b96b-4cea113fca51": {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-28.023940446379825, -48.615033030509956]
        },
        "properties": {
            "name": "Exemplo de Ponto",
            "description": "Este é um ponto de exemplo."
        }
    }
};
const IdCheck = (id: string) => {
    if (!id) {
        return {
            status: 400,
            json: { message: "Id not informed" },
        };
    }
}
export const GetById = (id: string): RequestReturn => {
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
export const GetAll = (): RequestReturn => {
    console.log('GetAll',{ features })
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
export const Post = (id: string, body: DataFormat): RequestReturn => {
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
export const Put = (id: string, body: DataFormat): RequestReturn => {
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
export const DeleteById = (id: string): RequestReturn => {
    try {
        console.log({id, features, featuresid: features[id]}, )

        const idCheck = IdCheck(id)
        if (idCheck) {
            return idCheck;
        }
        if (!features[id]) {
            return {
                status: 400,
                json: {
                    message: 'Register does not exist',
                }
            };
        } else {
            delete features[id];
            console.log(features[id]);
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
