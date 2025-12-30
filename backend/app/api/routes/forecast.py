from fastapi import APIRouter, HTTPException
from app.services.ml_forecast import generate_forecast, CATEGORY_BASE_PRICES
from app.models.schemas import PriceForecast

router = APIRouter()

VALID_CATEGORIES = ["groceries", "rent", "restaurants", "transport", "utilities", "healthcare"]


@router.get("/{city_id}/{category}", response_model=PriceForecast)
async def get_forecast(city_id: str, category: str):
    city_id = city_id.lower()
    category = category.lower()

    if category not in VALID_CATEGORIES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid category. Choose from: {', '.join(VALID_CATEGORIES)}",
        )

    if city_id not in CATEGORY_BASE_PRICES:
        raise HTTPException(status_code=404, detail=f"City '{city_id}' not found.")

    return generate_forecast(city_id, category)


@router.get("/{city_id}")
async def get_all_forecasts(city_id: str):
    city_id = city_id.lower()
    if city_id not in CATEGORY_BASE_PRICES:
        raise HTTPException(status_code=404, detail=f"City '{city_id}' not found.")

    return {
        "city": city_id,
        "forecasts": [generate_forecast(city_id, cat) for cat in VALID_CATEGORIES],
    }
