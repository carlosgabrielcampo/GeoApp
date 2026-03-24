import { Marker } from "react-leaflet"

import { PointsProps, PointInterface } from "@/types/points"


export default function PointsRenderer({ points, iconByType, clickPoint }: PointsProps) {

    return <>
        {
            points?.length && points
                .map(([keyValue, { properties, type, geometry }]) => {
                    return (
                        <Point
                            key={keyValue}
                            coordinates={geometry.coordinates}
                            icon={iconByType[type]}
                            name={properties.name}
                            description={properties.description}
                            eventHandlers={{ click: () => clickPoint({id: keyValue, properties, type, geometry}) }}
                        />
                    )
                })
        }
    </>
}


function Point({ coordinates, icon, eventHandlers }: PointInterface)
{
    return <Marker
        position={coordinates}
        icon={icon}
        eventHandlers={eventHandlers}
    >
    </Marker>
}
