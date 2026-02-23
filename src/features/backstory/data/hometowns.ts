import type { CityOption, Hometown, StateOption } from "../../../types/backstory";
import { CITIES_BY_STATE } from "./citiesByState";
import { DEFAULT_STATE_CODE, US_STATES } from "./states";

const toHometown = (city: CityOption): Hometown => ({
  slug: city.slug,
  city: city.city,
  stateCode: city.stateCode,
  state: city.state,
});

export const ALL_STATES: readonly StateOption[] = US_STATES;

export const getStateByCode = (stateCode: string): StateOption | undefined =>
  ALL_STATES.find((state) => state.code === stateCode);

export const getCitiesForState = (stateCode: string): readonly CityOption[] =>
  CITIES_BY_STATE[stateCode as keyof typeof CITIES_BY_STATE] ?? [];

export const DEFAULT_HOMETOWN: Hometown = toHometown(CITIES_BY_STATE[DEFAULT_STATE_CODE][0]);

export const findCityBySlug = (stateCode: string, citySlug: string): CityOption | undefined =>
  getCitiesForState(stateCode).find((city) => city.slug === citySlug);

export const resolveHometown = (stateCode: string, citySlug: string): Hometown => {
  const preferredStateCode = getStateByCode(stateCode)?.code ?? DEFAULT_STATE_CODE;
  const preferredCities = getCitiesForState(preferredStateCode);
  const resolvedCity =
    preferredCities.find((city) => city.slug === citySlug) ??
    preferredCities[0] ??
    CITIES_BY_STATE[DEFAULT_STATE_CODE][0];

  return toHometown(resolvedCity);
};

export const getDefaultStateCode = (): string => DEFAULT_STATE_CODE;

export const getDefaultCityForState = (stateCode: string): CityOption => {
  const cities = getCitiesForState(stateCode);
  return cities[0] ?? CITIES_BY_STATE[DEFAULT_STATE_CODE][0];
};

export const findCityByLegacySlug = (legacySlug: string): Hometown | undefined => {
  const normalized = legacySlug.trim().toLowerCase();
  for (const state of ALL_STATES) {
    const city = getCitiesForState(state.code).find((entry) => entry.slug === normalized);
    if (city) {
      return toHometown(city);
    }
  }
  return undefined;
};
