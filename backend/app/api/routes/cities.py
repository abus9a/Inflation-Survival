from fastapi import APIRouter, HTTPException
from app.services.numbeo import get_city_cost, get_all_cities, get_city_ids
from app.models.schemas import CityLivingCost

router = APIRouter()


@router.get("/", response_model=list[CityLivingCost])
async def list_cities():
    return await get_all_cities()


@router.get("/ids")
async def list_city_ids():
    return {"cities": get_city_ids()}


@router.get("/{city_id}", response_model=CityLivingCost)
async def get_city(city_id: str):
    city = await get_city_cost(city_id.lower())
    if not city:
        raise HTTPException(status_code=404, detail=f"City '{city_id}' not found.")
    return city
