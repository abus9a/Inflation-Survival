from fastapi import APIRouter
from app.services.exchange_rates import get_exchange_rates
from app.models.schemas import ExchangeRate

router = APIRouter()


@router.get("/", response_model=list[ExchangeRate])
async def get_rates():
    return await get_exchange_rates()
