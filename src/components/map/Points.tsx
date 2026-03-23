import { DataFormat } from "@/types/geojson"
import { Marker, Popup } from "react-leaflet"
import FeatureIcon from '@/assets/icons/pino-de-localizacao.ico'
import L from 'leaflet'


export default function PointsRenderer({ points, newPoint }: 
    { points: [string, DataFormat][], newPoint: [number, number] | null }
) {
    const iconByType = {
        'Feature': L.icon({
            iconUrl: FeatureIcon.src ?? FeatureIcon,
            iconSize: [32, 32],
        })
    }
    return <>
        {
            points?.length && points.map(([key, { properties, type, geometry }]) => {
                return (
                    <Marker key={key} position={geometry.coordinates} icon={iconByType[type]}>
                        <Popup>
                            <h3>{properties.name}</h3>
                            <p>{properties.description}</p>
                        </Popup>
                    </Marker>
                )
            })
        }
        {
            newPoint
                ? <Marker key={'new'} position={newPoint} icon={iconByType['Feature']}></Marker>
                : <></>
        }
    </>
}  