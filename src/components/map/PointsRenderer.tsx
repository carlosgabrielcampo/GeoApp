import { Marker } from "react-leaflet";

import { PointInterface, PointsProps } from "@/types/points";
import { toLeafletCoordinates } from "@/types/geojson";
import { iconByType } from "./constants";

export default function PointsRenderer({
  clickPoint,
  points,
  newPoint,
}: PointsProps) {
  return (
    <>
      {points?.length
        ? points.map(({ id, properties, type, geometry }) => {
            if (!id) { return null; }

            return (
              <Point
                key={id}
                coordinates={toLeafletCoordinates(geometry.coordinates)}
                icon={iconByType[type]}
                name={properties.name}
                description={properties.description}
                eventHandlers={{ click: () => clickPoint({ id, properties, type, geometry }) }}
              />
            );
          })
        : null}
      {newPoint ? (
        <Point
          key="New Point"
          coordinates={newPoint}
          icon={iconByType.Feature}
        />
      ) : null}
    </>
  );
}

function Point({ coordinates, icon, eventHandlers }: PointInterface) {
  return <Marker position={coordinates} icon={icon} eventHandlers={eventHandlers} />;
}
