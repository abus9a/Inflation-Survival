import type {
  CityLivingCost,
  ExchangeRate,
  PriceForecast,
  AIRecommendation,
  ScrapedPrice,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

export const api = {
  cities: {
    list: () => fetcher<CityLivingCost[]>("/api/cities/"),
    ids: () => fetcher<{ cities: string[] }>("/api/cities/ids"),
    get: (id: string) => fetcher<CityLivingCost>(`/api/cities/${id}`),
  },
  prices: {
    all: () => fetcher<ScrapedPrice[]>("/api/prices/"),
    byCity: (id: string) => fetcher<ScrapedPrice[]>(`/api/prices/${id}`),
  },
  forecast: {
    byCategory: (city: string, category: string) =>
      fetcher<PriceForecast>(`/api/forecast/${city}/${category}`),
    allForCity: (city: string) =>
      fetcher<{ city: string; forecasts: PriceForecast[] }>(`/api/forecast/${city}`),
  },
  exchange: {
    rates: () => fetcher<ExchangeRate[]>("/api/exchange/"),
  },
  recommendations: {
    get: (cityId: string) =>
      fetcher<AIRecommendation>(`/api/recommendations/${cityId}`),
    post: (city: string, budget?: number) =>
      fetcher<AIRecommendation>("/api/recommendations/", {
        method: "POST",
        body: JSON.stringify({ city, monthly_budget: budget }),
      }),
  },
};
