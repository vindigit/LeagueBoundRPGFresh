import type { Hometown } from "../../../types/backstory";

export const CURATED_HOMETOWNS: readonly Hometown[] = [
  { slug: "lewisville-tx", city: "Lewisville", state: "TX", prestige: 4 },
  { slug: "plano-tx", city: "Plano", state: "TX", prestige: 4 },
  { slug: "duncanville-tx", city: "Duncanville", state: "TX", prestige: 5 },
  { slug: "brooklyn-ny", city: "Brooklyn", state: "NY", prestige: 4 },
  { slug: "queens-ny", city: "Queens", state: "NY", prestige: 3 },
  { slug: "oakland-ca", city: "Oakland", state: "CA", prestige: 4 },
  { slug: "los-angeles-ca", city: "Los Angeles", state: "CA", prestige: 5 },
  { slug: "chicago-il", city: "Chicago", state: "IL", prestige: 5 },
  { slug: "indianapolis-in", city: "Indianapolis", state: "IN", prestige: 5 },
  { slug: "fort-wayne-in", city: "Fort Wayne", state: "IN", prestige: 4 },
  { slug: "miami-fl", city: "Miami", state: "FL", prestige: 4 },
  { slug: "atlanta-ga", city: "Atlanta", state: "GA", prestige: 4 },
  { slug: "charlotte-nc", city: "Charlotte", state: "NC", prestige: 3 },
  { slug: "philadelphia-pa", city: "Philadelphia", state: "PA", prestige: 4 },
  { slug: "detroit-mi", city: "Detroit", state: "MI", prestige: 4 },
  { slug: "las-vegas-nv", city: "Las Vegas", state: "NV", prestige: 3 },
  { slug: "seattle-wa", city: "Seattle", state: "WA", prestige: 3 },
  { slug: "new-orleans-la", city: "New Orleans", state: "LA", prestige: 3 },
] as const;

export const DEFAULT_HOMETOWN: Hometown = CURATED_HOMETOWNS[0];

export const getHometownBySlug = (slug: string): Hometown | undefined =>
  CURATED_HOMETOWNS.find((hometown) => hometown.slug === slug);
