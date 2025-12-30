from fastapi import APIRouter, HTTPException
from app.services.scraper import scrape_prices, scrape_all_prices
from app.models.schemas import ScrapedPrice

router = APIRouter()


@router.get("/", response_model=list[ScrapedPrice])
async def get_all_prices():
    return await scrape_all_prices()


@router.get("/{city_id}", response_model=list[ScrapedPrice])
async def get_city_prices(city_id: str):
    prices = await scrape_prices(city_id.lower())
    if not prices:
        raise HTTPException(status_code=404, detail=f"No price data for '{city_id}'.")
    return prices
