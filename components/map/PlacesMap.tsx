'use client';

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { divIcon, point, type LatLngBoundsExpression } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import type { EmpireConfig } from '@/lib/empires/config';
import type { Place } from '@/lib/services/places';

interface PlacesMapProps {
  empire: EmpireConfig;
  places: Place[];
}

function formatYear(year: number | null): string {
  if (year === null) {
    return 'Unknown';
  }

  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
}

function formatPlaceType(type: Place['type']): string {
  return type.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function getMapBounds(places: Place[]): LatLngBoundsExpression {
  if (places.length === 0) {
    return [
      [41.4, 12],
      [42.4, 13],
    ];
  }

  const lats = places.map((place) => place.lat ?? 0);
  const lngs = places.map((place) => place.lng ?? 0);

  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)],
  ];
}

function createPlaceIcon(color: string) {
  return divIcon({
    className: 'place-marker-icon',
    html: `<span style="background:${color};border-color:${color}33"></span>`,
    iconSize: point(14, 14, true),
  });
}

function createClusterIcon(color: string, count: number) {
  return divIcon({
    className: 'place-cluster-icon',
    html: `
      <span style="background:${color};box-shadow:0 0 0 6px ${color}33;">
        ${count}
      </span>
    `,
    iconSize: point(40, 40, true),
  });
}

type ClusterIconInput = {
  getChildCount(): number;
};

export function PlacesMap({ empire, places }: PlacesMapProps) {
  const bounds = getMapBounds(places);
  const placeIcon = createPlaceIcon(empire.color);

  return (
    <div className="overflow-hidden rounded-xl">
      <MapContainer
        bounds={bounds}
        scrollWheelZoom={true}
        className="h-[600px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup
          chunkedLoading
          showCoverageOnHover={false}
          iconCreateFunction={(cluster: ClusterIconInput) =>
            createClusterIcon(empire.color, cluster.getChildCount())
          }
        >
          {places.map((place) => {
            if (place.lat === null || place.lng === null) {
              return null;
            }

            return (
              <Marker
                key={place.id}
                position={[place.lat, place.lng]}
                icon={placeIcon}
              >
                <Popup>
                  <div className="space-y-1 text-sm text-zinc-900">
                    <p className="font-semibold">{place.name}</p>
                    <p>Type: {formatPlaceType(place.type)}</p>
                    <p>Founded: {formatYear(place.founded_year)}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      <style jsx global>{`
        .place-marker-icon {
          background: transparent;
          border: 0;
        }

        .place-marker-icon span {
          display: block;
          width: 14px;
          height: 14px;
          border: 2px solid;
          border-radius: 9999px;
          box-shadow: 0 0 0 2px rgba(10, 10, 10, 0.65);
        }

        .place-cluster-icon {
          background: transparent;
          border: 0;
        }

        .place-cluster-icon span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 9999px;
          color: #fff;
          font-size: 0.875rem;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
