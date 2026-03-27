'use client';

import { useMemo, useState } from 'react';
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

type PlaceTypeFilter = Place['type'] | 'all';

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
  const [activeType, setActiveType] = useState<PlaceTypeFilter>('all');
  const availableTypes = useMemo(
    () => [...new Set(places.map((place) => place.type))].sort(),
    [places]
  );
  const filteredPlaces = useMemo(
    () =>
      activeType === 'all'
        ? places
        : places.filter((place) => place.type === activeType),
    [activeType, places]
  );
  const bounds = getMapBounds(filteredPlaces);
  const placeIcon = createPlaceIcon(empire.color);

  return (
    <div className="space-y-4 overflow-hidden rounded-xl">
      <div className="flex flex-col gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Place Type
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveType('all')}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                activeType === 'all'
                  ? 'border-transparent text-white'
                  : 'border-zinc-700 bg-zinc-950/70 text-zinc-300 hover:border-zinc-600 hover:text-white'
              }`}
              style={
                activeType === 'all'
                  ? {
                      backgroundColor: empire.color,
                    }
                  : undefined
              }
            >
              All
            </button>

            {availableTypes.map((type) => {
              const isActive = activeType === type;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveType(type)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    isActive
                      ? 'border-transparent text-white'
                      : 'border-zinc-700 bg-zinc-950/70 text-zinc-300 hover:border-zinc-600 hover:text-white'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: empire.color,
                        }
                      : undefined
                  }
                >
                  {formatPlaceType(type)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 text-sm text-zinc-300 sm:flex-row sm:items-center sm:gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Visible Places
            </p>
            <p className="mt-1 text-base font-semibold text-white">
              {filteredPlaces.length}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Legend</p>
            <div className="mt-1 flex items-center gap-2">
              <span
                className="block h-3.5 w-3.5 rounded-full border-2 shadow-[0_0_0_2px_rgba(10,10,10,0.65)]"
                style={{
                  backgroundColor: empire.color,
                  borderColor: `${empire.color}33`,
                }}
              />
              <span>Mapped place marker</span>
            </div>
          </div>
        </div>
      </div>

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
          {filteredPlaces.map((place) => {
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
