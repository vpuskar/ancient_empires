'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { createBrowserClient } from '@supabase/ssr';
import type { EmpireConfig } from '@/lib/empires/config';

import 'leaflet/dist/leaflet.css';

// ---------------------------------------------------------------------------
// Fix Leaflet default icon issue in SSR / bundled environments
// ---------------------------------------------------------------------------
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface MapPlace {
  id: number;
  name: string;
  native_name: string | null;
  type: string;
  lat: number;
  lng: number;
  province_id: number | null;
  founded_year: number | null;
  description: string | null;
  province: { name: string } | null;
}

interface Battle {
  id: number;
  name: string;
  year: number;
  lat: number;
  lng: number;
  outcome: string | null;
  opposing_force: string | null;
  casualties: number | null;
  description: string | null;
}

interface Province {
  id: number;
  name: string;
}

// ---------------------------------------------------------------------------
// Marker icons
// ---------------------------------------------------------------------------
function circleIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 12px; height: 12px; border-radius: 50%;
      background: ${color}; border: 2px solid #F0ECE2;
      box-shadow: 0 0 4px rgba(0,0,0,.5);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -8],
  });
}

const PLACE_ICONS: Record<string, L.DivIcon> = {
  city: circleIcon('#C9A84C'),
  capital: circleIcon('#C9A84C'),
  fort: circleIcon('#8B0000'),
  temple: circleIcon('#9370DB'),
  port: circleIcon('#4682B4'),
  other: circleIcon('#8B7355'),
};

const BATTLE_ICON = L.divIcon({
  className: '',
  html: `<div style="
    width: 14px; height: 14px; transform: rotate(45deg);
    background: #DC143C; border: 2px solid #F0ECE2;
    box-shadow: 0 0 4px rgba(0,0,0,.5);
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -10],
});

// ---------------------------------------------------------------------------
// Legend colors
// ---------------------------------------------------------------------------
const LEGEND_ITEMS = [
  { label: 'City / Capital', color: '#C9A84C', shape: 'circle' },
  { label: 'Fort', color: '#8B0000', shape: 'circle' },
  { label: 'Temple', color: '#9370DB', shape: 'circle' },
  { label: 'Port', color: '#4682B4', shape: 'circle' },
  { label: 'Battle Site', color: '#DC143C', shape: 'diamond' },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
}

// ---------------------------------------------------------------------------
// MapBoundsHandler — auto-fits bounds when visible markers change
// ---------------------------------------------------------------------------
function MapBoundsHandler({ points }: { points: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points.map(([lat, lng]) => [lat, lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
  }, [map, points]);

  return null;
}

// ---------------------------------------------------------------------------
// Popup styles (injected once)
// ---------------------------------------------------------------------------
const POPUP_CSS = `
  .museum-popup .leaflet-popup-content-wrapper {
    background: #0C0B09;
    border: 1px solid #C9A84C;
    border-radius: 8px;
    color: #F0ECE2;
    box-shadow: 0 4px 24px rgba(0,0,0,.6);
    padding: 0;
  }
  .museum-popup .leaflet-popup-content {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
  }
  .museum-popup .leaflet-popup-tip {
    background: #0C0B09;
    border: 1px solid #C9A84C;
    border-top: none;
    border-left: none;
  }
  .museum-popup .leaflet-popup-close-button {
    color: #8B7355 !important;
    font-size: 18px !important;
    top: 6px !important;
    right: 8px !important;
  }
  .museum-popup .leaflet-popup-close-button:hover {
    color: #C9A84C !important;
  }
`;

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function MapInner({ empire }: { empire: EmpireConfig }) {
  const [places, setPlaces] = useState<MapPlace[]>([]);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [showBattles, setShowBattles] = useState(true);

  // Inject popup CSS once
  useEffect(() => {
    const id = 'museum-popup-css';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = POPUP_CSS;
    document.head.appendChild(style);
  }, []);

  // Fetch data
  useEffect(() => {
    async function load() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
      );

      const [placesRes, battlesRes, provincesRes] = await Promise.all([
        supabase
          .from('places')
          .select(
            'id, name, native_name, type, lat, lng, province_id, founded_year, description, province:provinces!places_province_id_fkey(name)'
          )
          .eq('empire_id', empire.id)
          .order('name'),
        supabase
          .from('battles')
          .select(
            'id, name, year, lat, lng, outcome, opposing_force, casualties, description'
          )
          .eq('empire_id', empire.id)
          .order('year'),
        supabase
          .from('provinces')
          .select('id, name')
          .eq('empire_id', empire.id)
          .order('name'),
      ]);

      setPlaces((placesRes.data as unknown as MapPlace[]) ?? []);
      setBattles(battlesRes.data ?? []);
      setProvinces(provincesRes.data ?? []);
      setLoading(false);
    }

    load();
  }, [empire.id]);

  // Filtered places
  const filteredPlaces = useMemo(
    () =>
      selectedProvince
        ? places.filter((p) => p.province_id === selectedProvince)
        : places,
    [places, selectedProvince]
  );

  // All visible points for bounds fitting
  const visiblePoints = useMemo<[number, number][]>(() => {
    const pts: [number, number][] = filteredPlaces.map((p) => [p.lat, p.lng]);
    if (showBattles) {
      battles.forEach((b) => pts.push([b.lat, b.lng]));
    }
    return pts;
  }, [filteredPlaces, battles, showBattles]);

  if (loading) {
    return (
      <div className="mx-6 flex h-[calc(100vh-140px)] items-center justify-center rounded-lg border border-[#8B7355] bg-[#1a1815]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#8B7355] border-t-[#C9A84C]" />
          <p className="text-sm tracking-widest text-[#8B7355] uppercase">
            Loading {empire.name} map data&hellip;
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-6 mb-6 h-[calc(100vh-140px)] overflow-hidden rounded-lg border border-[#8B7355]">
      <MapContainer
        center={[41.9, 12.5]}
        zoom={5}
        className="h-full w-full"
        style={{
          filter: 'sepia(15%) saturate(80%) hue-rotate(15deg)',
        }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        />

        <MapBoundsHandler points={visiblePoints} />

        {/* Place markers */}
        {filteredPlaces.map((place) => (
          <Marker
            key={`place-${place.id}`}
            position={[place.lat, place.lng]}
            icon={PLACE_ICONS[place.type] ?? PLACE_ICONS.other}
          >
            <Popup className="museum-popup" maxWidth={280}>
              <div className="p-4">
                <h3 className="text-base font-bold text-[#C9A84C]">
                  {place.name}
                </h3>
                {place.native_name && (
                  <p className="mt-0.5 text-xs italic text-[#8B7355]">
                    {place.native_name}
                  </p>
                )}
                <div className="mt-2 space-y-1 text-xs text-[#F0ECE2]/80">
                  {place.province?.name && (
                    <p>
                      <span className="text-[#8B7355]">Province:</span>{' '}
                      {place.province.name}
                    </p>
                  )}
                  {place.founded_year != null && (
                    <p>
                      <span className="text-[#8B7355]">Founded:</span>{' '}
                      {formatYear(place.founded_year)}
                    </p>
                  )}
                  <p>
                    <span className="text-[#8B7355]">Type:</span>{' '}
                    <span className="capitalize">{place.type}</span>
                  </p>
                </div>
                {place.description && (
                  <p className="mt-2 text-xs leading-relaxed text-[#F0ECE2]/70">
                    {place.description}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Battle markers */}
        {showBattles &&
          battles.map((battle) => (
            <Marker
              key={`battle-${battle.id}`}
              position={[battle.lat, battle.lng]}
              icon={BATTLE_ICON}
            >
              <Popup className="museum-popup" maxWidth={280}>
                <div className="p-4">
                  <h3 className="text-base font-bold text-[#DC143C]">
                    {battle.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-[#8B7355]">
                    {formatYear(battle.year)}
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-[#F0ECE2]/80">
                    {battle.opposing_force && (
                      <p>
                        <span className="text-[#8B7355]">Against:</span>{' '}
                        {battle.opposing_force}
                      </p>
                    )}
                    {battle.outcome && (
                      <p>
                        <span className="text-[#8B7355]">Outcome:</span>{' '}
                        <span className="capitalize">{battle.outcome}</span>
                      </p>
                    )}
                    {battle.casualties != null && (
                      <p>
                        <span className="text-[#8B7355]">Casualties:</span>{' '}
                        {battle.casualties.toLocaleString()}
                      </p>
                    )}
                  </div>
                  {battle.description && (
                    <p className="mt-2 text-xs leading-relaxed text-[#F0ECE2]/70">
                      {battle.description}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* Controls panel */}
      <div className="absolute left-4 top-4 z-[1000] flex max-w-xs flex-col gap-3">
        {/* Province filter */}
        <div className="rounded-lg border border-[#8B7355] bg-[#0C0B09]/95 p-3 shadow-2xl backdrop-blur-sm">
          <label className="mb-1.5 block text-xs font-medium tracking-widest text-[#8B7355] uppercase">
            Province
          </label>
          <select
            value={selectedProvince ?? ''}
            onChange={(e) =>
              setSelectedProvince(
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="w-full rounded border border-[#8B7355]/50 bg-[#1a1815] px-2 py-1.5 text-sm text-[#F0ECE2] outline-none focus:border-[#C9A84C]"
          >
            <option value="">All Provinces</option>
            {provinces.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.name}
              </option>
            ))}
          </select>
        </div>

        {/* Battle sites toggle */}
        <div className="rounded-lg border border-[#8B7355] bg-[#0C0B09]/95 p-3 shadow-2xl backdrop-blur-sm">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[#F0ECE2]">
            <input
              type="checkbox"
              checked={showBattles}
              onChange={(e) => setShowBattles(e.target.checked)}
              className="accent-[#DC143C]"
            />
            <span>Battle Sites</span>
            <span className="ml-auto text-xs text-[#8B7355]">
              {battles.length}
            </span>
          </label>
        </div>

        {/* Legend */}
        <div className="rounded-lg border border-[#8B7355] bg-[#0C0B09]/95 p-3 shadow-2xl backdrop-blur-sm">
          <p className="mb-2 text-xs font-medium tracking-widest text-[#8B7355] uppercase">
            Legend
          </p>
          <div className="space-y-1.5">
            {LEGEND_ITEMS.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-xs text-[#F0ECE2]/80"
              >
                <span
                  className={
                    item.shape === 'diamond'
                      ? 'inline-block h-2.5 w-2.5 rotate-45'
                      : 'inline-block h-2.5 w-2.5 rounded-full'
                  }
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Place count */}
      <div className="absolute bottom-4 right-4 z-[1000] rounded-lg border border-[#8B7355] bg-[#0C0B09]/95 px-3 py-2 shadow-2xl backdrop-blur-sm">
        <p className="text-xs text-[#8B7355]">
          <span className="font-medium text-[#F0ECE2]">
            {filteredPlaces.length.toLocaleString()}
          </span>{' '}
          places
          {showBattles && (
            <>
              {' · '}
              <span className="font-medium text-[#F0ECE2]">
                {battles.length}
              </span>{' '}
              battles
            </>
          )}
        </p>
      </div>
    </div>
  );
}
