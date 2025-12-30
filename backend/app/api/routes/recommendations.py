from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini import generate_recommendations
from app.services.numbeo import get_city_cost, get_city_ids
from app.models.schemas import AIRecommendation

router = APIRouter()


class RecommendationRequest(BaseModel):
    city: str
    monthly_budget: Optional[float] = None


@router.post("/", response_model=AIRecommendation)
async def get_recommendations(req: RecommendationRequest):
    city_id = req.city.lower()

    if city_id not in get_city_ids():
        raise HTTPException(status_code=404, detail=f"City '{req.city}' not found.")

    city_data = await get_city_cost(city_id)
    budget = req.monthly_budget or city_data.monthly_total_usd

    expense_breakdown = {
        cat.name: cat.usd_equivalent for cat in city_data.categories
    }

    return await generate_recommendations(
        city=city_data.city.name,
        monthly_budget=budget,
        expense_breakdown=expense_breakdown,
    )


@router.get("/{city_id}", response_model=AIRecommendation)
async def get_recommendations_by_city(city_id: str):
    city_id = city_id.lower()

    if city_id not in get_city_ids():
        raise HTTPException(status_code=404, detail=f"City '{city_id}' not found.")

    city_data = await get_city_cost(city_id)
    expense_breakdown = {
        cat.name: cat.usd_equivalent for cat in city_data.categories
    }

    return await generate_recommendations(
        city=city_data.city.name,
        monthly_budget=city_data.monthly_total_usd,
        expense_breakdown=expense_breakdown,
    )
