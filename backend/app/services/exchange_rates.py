from datetime import datetime
from app.models.schemas import ExchangeRate

MOCK_RATES: list[dict] = [
    {"currency": "KZT", "symbol": "₸", "rate": 454.2, "change_24h": 0.3},
    {"currency": "TRY", "symbol": "₺", "rate": 32.1, "change_24h": -0.8},
    {"currency": "EUR", "symbol": "€", "rate": 0.926, "change_24h": 0.1},
    {"currency": "AED", "symbol": "د.إ", "rate": 3.673, "change_24h": 0.0},
    {"currency": "THB", "symbol": "฿", "rate": 36.7, "change_24h": -0.2},
    {"currency": "PLN", "symbol": "zł", "rate": 4.10, "change_24h": 0.4},
    {"currency": "RUB", "symbol": "₽", "rate": 89.5, "change_24h": 1.2},
    {"currency": "GBP", "symbol": "£", "rate": 0.792, "change_24h": -0.1},
    {"currency": "JPY", "symbol": "¥", "rate": 154.3, "change_24h": 0.5},
    {"currency": "CNY", "symbol": "¥", "rate": 7.24, "change_24h": 0.0},
]


async def get_exchange_rates() -> list[ExchangeRate]:
    return [
        ExchangeRate(
            base="USD",
            currency=r["currency"],
            symbol=r["symbol"],
            rate=r["rate"],
            change_24h=r["change_24h"],
            updated_at=datetime.utcnow(),
        )
        for r in MOCK_RATES
    ]
