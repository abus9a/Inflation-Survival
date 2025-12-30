export interface CityInfo {
  id: string;
  name: string;
  country: string;
  currency: string;
  lat: number;
  lng: number;
}

export interface CostCategory {
  name: string;
  amount: number;
  currency: string;
  usd_equivalent: number;
}

export interface CityLivingCost {
  city: CityInfo;
  monthly_total_usd: number;
  categories: CostCategory[];
  cost_index: number;
  rent_index: number;
  groceries_index: number;
  restaurant_index: number;
  purchasing_power_index: number;
  annual_inflation: number;
  updated_at: string;
}

export interface ExchangeRate {
  base: string;
  currency: string;
  symbol: string;
  rate: number;
  change_24h: number;
  updated_at: string;
}

export interface ForecastPoint {
  date: string;
  actual: number | null;
  predicted: number;
  lower_bound: number;
  upper_bound: number;
}

export interface PriceForecast {
  city: string;
  category: string;
  currency: string;
  current_price: number;
  forecast_3m: number;
  forecast_6m: number;
  forecast_12m: number;
  inflation_rate: number;
  trend: "rising" | "falling" | "stable";
  data_points: ForecastPoint[];
}

export interface AIRecommendation {
  city: string;
  monthly_budget: number;
  potential_savings: number;
  savings_percentage: number;
  tips: string[];
  priority_actions: string[];
  generated_at: string;
}

export interface ScrapedPrice {
  source: string;
  item: string;
  price: number;
  currency: string;
  city: string;
  url: string;
  scraped_at: string;
}

export interface CityComparison {
  city_a: CityLivingCost;
  city_b: CityLivingCost;
  monthly_savings: number;
  savings_percentage: number;
  cheaper_city: string;
  category_diff: Record<string, number>;
}
