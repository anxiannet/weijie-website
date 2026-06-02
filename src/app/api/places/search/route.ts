import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/client";
import type { Place } from "@/types";

type OneMapResult = {
  SEARCHVAL?: string;
  BLK_NO?: string;
  ROAD_NAME?: string;
  BUILDING?: string;
  ADDRESS?: string;
  POSTAL?: string;
  LATITUDE?: string;
  LONGITUDE?: string;
};

type OneMapResponse = {
  found?: number;
  results?: OneMapResult[];
};

const oneMapUrl = "https://www.onemap.gov.sg/api/common/elastic/search";
const memoryCache = (
  globalThis as typeof globalThis & { __weijiePlacesCache?: Map<string, Place[]> }
).__weijiePlacesCache ?? new Map<string, Place[]>();

(globalThis as typeof globalThis & { __weijiePlacesCache?: Map<string, Place[]> }).__weijiePlacesCache = memoryCache;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeAddress(result: OneMapResult) {
  const address = clean(result.ADDRESS);
  if (address) return address;
  return [clean(result.BLK_NO), clean(result.ROAD_NAME), clean(result.POSTAL) ? `Singapore ${clean(result.POSTAL)}` : ""]
    .filter(Boolean)
    .join(" ");
}

function categoryFor(place: Pick<Place, "name" | "address">) {
  const text = `${place.name} ${place.address}`.toLowerCase();
  if (/\bmrt\b|station|地铁/.test(text)) return "MRT";
  if (/university|school|polytechnic|college|ntu|nus|smu|sutd|sit|suss|学校|校园/.test(text)) return "学校";
  if (/hdb|blk\s|block\s|组屋/.test(text)) return "HDB";
  if (/mall|plaza|point|junction|square|centre|shopping|商场/.test(text)) return "商场";
  if (/restaurant|cafe|coffee|food|hawker|kopitiam|餐厅|食阁/.test(text)) return "餐厅";
  if (/community club|community centre| cc\b|社区/.test(text)) return "社区中心";
  if (/condominium|condo|apartment|residence|floravale|parc|mansion|公寓/.test(text)) return "住宅区";
  return "地点";
}

function normalizeResult(result: OneMapResult, query: string): Place {
  const name = clean(result.BUILDING) && clean(result.BUILDING) !== "NIL"
    ? clean(result.BUILDING)
    : clean(result.SEARCHVAL);
  const address = normalizeAddress(result);
  const postal = clean(result.POSTAL) || null;
  const lat = Number.parseFloat(clean(result.LATITUDE));
  const lng = Number.parseFloat(clean(result.LONGITUDE));
  const place: Place = {
    query,
    name: name || address,
    address,
    postal,
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
    source: "onemap",
    raw: result
  };

  return {
    ...place,
    category: categoryFor(place)
  };
}

function mapCacheRow(row: {
  id?: string;
  query?: string | null;
  name: string;
  address: string;
  postal?: string | null;
  lat?: number | string | null;
  lng?: number | string | null;
  source?: string | null;
  raw?: unknown;
}): Place {
  const lat = typeof row.lat === "string" ? Number.parseFloat(row.lat) : row.lat;
  const lng = typeof row.lng === "string" ? Number.parseFloat(row.lng) : row.lng;
  const place: Place = {
    id: row.id,
    query: row.query,
    name: row.name,
    address: row.address,
    postal: row.postal,
    lat: Number.isFinite(lat) ? lat ?? null : null,
    lng: Number.isFinite(lng) ? lng ?? null : null,
    source: row.source,
    raw: row.raw
  };

  return {
    ...place,
    category: categoryFor(place)
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ places: [] });
  }

  const normalizedQuery = query.toLowerCase();
  const supabase = getSupabaseServiceClient();
  const cachedPlaces = memoryCache.get(normalizedQuery);

  if (cachedPlaces?.length) {
    return NextResponse.json({ places: cachedPlaces, source: "memory-cache" });
  }

  if (supabase) {
    const { data, error } = await supabase
      .from("places_cache")
      .select("id, query, name, address, postal, lat, lng, source, raw")
      .eq("query", normalizedQuery)
      .order("created_at", { ascending: false })
      .limit(12);

    if (!error && data?.length) {
      return NextResponse.json({ places: data.map(mapCacheRow), source: "cache" });
    }
  }

  const response = await fetch(`${oneMapUrl}?${new URLSearchParams({
    searchVal: query,
    returnGeom: "Y",
    getAddrDetails: "Y",
    pageNum: "1"
  })}`, {
    headers: { "User-Agent": "weijie-website/1.0" }
  });

  if (!response.ok) {
    return NextResponse.json({ error: "OneMap 搜索暂时不可用" }, { status: 502 });
  }

  const payload = (await response.json()) as OneMapResponse;
  const places = (payload.results ?? [])
    .map((result) => normalizeResult(result, normalizedQuery))
    .filter((place) => place.name && place.address)
    .slice(0, 12);

  if (places.length) {
    memoryCache.set(normalizedQuery, places);
  }

  if (supabase && places.length) {
    await supabase.from("places_cache").insert(places.map((place) => ({
      query: normalizedQuery,
      name: place.name,
      address: place.address,
      postal: place.postal,
      lat: place.lat,
      lng: place.lng,
      source: place.source,
      raw: place.raw
    })));
  }

  return NextResponse.json({ places, source: "onemap" });
}
