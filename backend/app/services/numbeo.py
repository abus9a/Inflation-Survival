from datetime import datetime
from typing import Optional
from app.models.schemas import CityLivingCost, CityInfo, CostCategory

CITIES_MOCK: dict = {
    "astana": {
        "name": "Astana", "country": "Kazakhstan", "currency": "KZT",
        "lat": 51.1605, "lng": 71.4704,
        "monthly_total_usd": 870,
        "categories": [
            {"name": "Rent (1BR Center)", "amount": 180000, "usd": 395},
            {"name": "Groceries", "amount": 60000, "usd": 132},
            {"name": "Restaurants", "amount": 40000, "usd": 88},
            {"name": "Transport", "amount": 12000, "usd": 26},
            {"name": "Utilities", "amount": 35000, "usd": 77},
            {"name": "Healthcare", "amount": 20000, "usd": 44},
            {"name": "Entertainment", "amount": 25000, "usd": 55},
            {"name": "Clothing", "amount": 24000, "usd": 53},
        ],
        "cost_index": 32.5, "rent_index": 15.8, "groceries_index": 28.4,
        "restaurant_index": 19.6, "purchasing_power_index": 38.2, "annual_inflation": 8.5,
    },
    "almaty": {
        "name": "Almaty", "country": "Kazakhstan", "currency": "KZT",
        "lat": 43.2220, "lng": 76.8512,
        "monthly_total_usd": 1050,
        "categories": [
            {"name": "Rent (1BR Center)", "amount": 230000, "usd": 505},
            {"name": "Groceries", "amount": 70000, "usd": 154},
            {"name": "Restaurants", "amount": 50000, "usd": 110},
            {"name": "Transport", "amount": 15000, "usd": 33},
            {"name": "Utilities", "amount": 40000, "usd": 88},
            {"name": "Healthcare", "amount": 25000, "usd": 55},
            {"name": "Entertainment", "amount": 35000, "usd": 77},
            {"name": "Clothing", "amount": 28000, "usd": 62},
        ],
        "cost_index": 38.1, "rent_index": 20.3, "groceries_index": 32.7,
        "restaurant_index": 24.1, "purchasing_power_index": 42.5, "annual_inflation": 9.2,
    },
    "istanbul": {
        "name": "Istanbul", "country": "Turkey", "currency": "TRY",
        "lat": 41.0082, "lng": 28.9784,
        "monthly_total_usd": 720,
        "categories": [
            {"name": "Rent (1BR Center)", "amount": 18000, "usd": 320},
            {"name": "Groceries", "amount": 8000, "usd": 142},
            {"name": "Restaurants", "amount": 5000, "usd": 89},
            {"name": "Transport", "amount": 1200, "usd": 21},
            {"name": "Utilities", "amount": 2500, "usd": 44},
            {"name": "Healthcare", "amount": 1500, "usd": 27},
            {"name": "Entertainment", "amount": 3000, "usd": 53},
            {"name": "Clothing", "amount": 1400, "usd": 25},
        ],
        "cost_index": 28.9, "rent_index": 16.2, "groceries_index": 34.5,
        "restaurant_index": 22.8, "purchasing_power_index": 28.7, "annual_inflation": 45.0,
    },
    "berlin": {
        "name": "Berlin", "country": "Germany", "currency": "EUR",
        "lat": 52.5200, "lng": 13.4050,
        "monthly_total_usd": 2400,
        "categories": [
            {"name": "Rent (1BR Center)", "amount": 1350, "usd": 1458},
            {"name": "Groceries", "amount": 280, "usd": 302},
            {"name": "Restaurants", "amount": 220, "usd": 238},
            {"name": "Transport", "amount": 90, "usd": 97},
            {"name": "Utilities", "amount": 170, "usd": 184},
            {"name": "Healthcare", "amount": 50, "usd": 54},
            {"name": "Entertainment", "amount": 100, "usd": 108},
            {"name": "Clothing", "amount": 120, "usd": 130},
        ],
        "cost_index": 68.4, "rent_index": 52.1, "groceries_index": 58.3,
        "restaurant_index": 61.7, "purchasing_power_index": 92.4, "annual_inflation": 3.2,
    },
    "dubai": {
        "name": "Dubai", "country": "UAE", "currency": "AED",
        "lat": 25.2048, "lng": 55.2708,
        "monthly_total_usd": 2800,
        "categories": [
            {"name": "Rent (1BR Center)", "amount": 6500, "usd": 1770},
            {"name": "Groceries", "amount": 1100, "usd": 300},
            {"name": "Restaurants", "amount": 900, "usd": 245},
            {"name": "Transport", "amount": 400, "usd": 109},
            {"name": "Utilities", "amount": 550, "usd": 150},
            {"name": "Healthcare", "amount": 350, "usd": 95},
            {"name": "Entertainment", "amount": 500, "usd": 136},
            {"name": "Clothing", "amount": 330, "usd": 90},
        ],
        "cost_index": 72.6, "rent_index": 68.4, "groceries_index": 55.2,
        "restaurant_index": 58.9, "purchasing_power_index": 108.3, "annual_inflation": 2.1,
    },
    "bangkok": {
        "name": "Bangkok", "country": "Thailand", "currency": "THB",
        "lat": 13.7563, "lng": 100.5018,
        "monthly_total_usd": 820,
        "categories": [
            {"name": "Rent (1BR Center)", "amount": 18000, "usd": 490},
            {"name": "Groceries", "amount": 8000, "usd": 218},
            {"name": "Restaurants", "amount": 5000, "usd": 136},
            {"name": "Transport", "amount": 1500, "usd": 41},
            {"name": "Utilities", "amount": 2500, "usd": 68},
            {"name": "Healthcare", "amount": 1200, "usd": 33},
            {"name": "Entertainment", "amount": 3000, "usd": 82},
            {"name": "Clothing", "amount": 2800, "usd": 76},
        ],
        "cost_index": 38.7, "rent_index": 22.5, "groceries_index": 35.1,
        "restaurant_index": 28.6, "purchasing_power_index": 44.8, "annual_inflation": 4.1,
    },
    "warsaw": {
        "name": "Warsaw", "country": "Poland", "currency": "PLN",
        "lat": 52.2297, "lng": 21.0122,
        "monthly_total_usd": 1300,
        "categories": [
            {"name": "Rent (1BR Center)", "amount": 3200, "usd": 780},
            {"name": "Groceries", "amount": 1100, "usd": 268},
            {"name": "Restaurants", "amount": 750, "usd": 183},
            {"name": "Transport", "amount": 140, "usd": 34},
            {"name": "Utilities", "amount": 600, "usd": 146},
            {"name": "Healthcare", "amount": 200, "usd": 49},
            {"name": "Entertainment", "amount": 350, "usd": 85},
            {"name": "Clothing", "amount": 280, "usd": 68},
        ],
        "cost_index": 44.2, "rent_index": 28.7, "groceries_index": 40.3,
        "restaurant_index": 36.5, "purchasing_power_index": 65.1, "annual_inflation": 5.8,
    },
    "moscow": {
        "name": "Moscow", "country": "Russia", "currency": "RUB",
        "lat": 55.7558, "lng": 37.6173,
        "monthly_total_usd": 950,
        "categories": [
            {"name": "Rent (1BR Center)", "amount": 55000, "usd": 480},
            {"name": "Groceries", "amount": 22000, "usd": 192},
            {"name": "Restaurants", "amount": 18000, "usd": 157},
            {"name": "Transport", "amount": 3000, "usd": 26},
            {"name": "Utilities", "amount": 8000, "usd": 70},
            {"name": "Healthcare", "amount": 5000, "usd": 44},
            {"name": "Entertainment", "amount": 10000, "usd": 87},
            {"name": "Clothing", "amount": 12000, "usd": 105},
        ],
        "cost_index": 41.3, "rent_index": 22.1, "groceries_index": 36.8,
        "restaurant_index": 29.4, "purchasing_power_index": 48.6, "annual_inflation": 7.4,
    },
}


def _build_city_cost(city_id: str) -> Optional[CityLivingCost]:
    data = CITIES_MOCK.get(city_id)
    if not data:
        return None

    city_info = CityInfo(
        id=city_id,
        name=data["name"],
        country=data["country"],
        currency=data["currency"],
        lat=data["lat"],
        lng=data["lng"],
    )

    categories = [
        CostCategory(
            name=cat["name"],
            amount=cat["amount"],
            currency=data["currency"],
            usd_equivalent=cat["usd"],
        )
        for cat in data["categories"]
    ]

    return CityLivingCost(
        city=city_info,
        monthly_total_usd=data["monthly_total_usd"],
        categories=categories,
        cost_index=data["cost_index"],
        rent_index=data["rent_index"],
        groceries_index=data["groceries_index"],
        restaurant_index=data["restaurant_index"],
        purchasing_power_index=data["purchasing_power_index"],
        annual_inflation=data["annual_inflation"],
        updated_at=datetime.utcnow(),
    )


async def get_city_cost(city_id: str) -> Optional[CityLivingCost]:
    return _build_city_cost(city_id)


async def get_all_cities() -> list[CityLivingCost]:
    return [_build_city_cost(city_id) for city_id in CITIES_MOCK]


def get_city_ids() -> list[str]:
    return list(CITIES_MOCK.keys())
