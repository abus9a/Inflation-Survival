from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class CityInfo(BaseModel):
    id: str
    name: str
    country: str
    currency: str
    lat: float
    lng: float


class CostCategory(BaseModel):
    name: str
    amount: float
    currency: str
    usd_equivalent: float


class CityLivingCost(BaseModel):
    city: CityInfo
    monthly_total_usd: float
    categories: List[CostCategory]
    cost_index: float
    rent_index: float
    groceries_index: float
    restaurant_index: float
    purchasing_power_index: float
    annual_inflation: float
    updated_at: datetime


class ExchangeRate(BaseModel):
    base: str
    currency: str
    symbol: str
    rate: float
    change_24h: float
    updated_at: datetime


class ForecastPoint(BaseModel):
    date: str
    actual: Optional[float] = None
    predicted: float
    lower_bound: float
    upper_bound: float


class PriceForecast(BaseModel):
    city: str
    category: str
    currency: str
    current_price: float
    forecast_3m: float
    forecast_6m: float
    forecast_12m: float
    inflation_rate: float
    trend: str
    data_points: List[ForecastPoint]


class CityComparison(BaseModel):
    city_a: CityLivingCost
    city_b: CityLivingCost
    monthly_savings: float
    savings_percentage: float
    cheaper_city: str
    category_diff: dict


class AIRecommendation(BaseModel):
    city: str
    monthly_budget: float
    potential_savings: float
    savings_percentage: float
    tips: List[str]
    priority_actions: List[str]
    generated_at: datetime


class ScrapedPrice(BaseModel):
    source: str
    item: str
    price: float
    currency: str
    city: str
    url: str
    scraped_at: datetime
