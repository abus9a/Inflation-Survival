import httpx
from datetime import datetime
from app.models.schemas import ScrapedPrice

MOCK_SCRAPED: list[dict] = [
    {"source": "Magnum (Astana)", "item": "1kg Chicken Breast", "price": 2890, "currency": "KZT", "city": "astana"},
    {"source": "Magnum (Astana)", "item": "1L Milk", "price": 380, "currency": "KZT", "city": "astana"},
    {"source": "Magnum (Astana)", "item": "1kg Bread", "price": 290, "currency": "KZT", "city": "astana"},
    {"source": "Small (Almaty)", "item": "1kg Chicken Breast", "price": 3100, "currency": "KZT", "city": "almaty"},
    {"source": "Small (Almaty)", "item": "1L Milk", "price": 410, "currency": "KZT", "city": "almaty"},
    {"source": "Small (Almaty)", "item": "1kg Bread", "price": 320, "currency": "KZT", "city": "almaty"},
    {"source": "BIM (Istanbul)", "item": "1kg Chicken Breast", "price": 245, "currency": "TRY", "city": "istanbul"},
    {"source": "BIM (Istanbul)", "item": "1L Milk", "price": 38, "currency": "TRY", "city": "istanbul"},
    {"source": "BIM (Istanbul)", "item": "1kg Bread", "price": 22, "currency": "TRY", "city": "istanbul"},
    {"source": "REWE (Berlin)", "item": "1kg Chicken Breast", "price": 8.99, "currency": "EUR", "city": "berlin"},
    {"source": "REWE (Berlin)", "item": "1L Milk", "price": 1.09, "currency": "EUR", "city": "berlin"},
    {"source": "REWE (Berlin)", "item": "1kg Bread", "price": 2.49, "currency": "EUR", "city": "berlin"},
    {"source": "Carrefour (Dubai)", "item": "1kg Chicken Breast", "price": 28.5, "currency": "AED", "city": "dubai"},
    {"source": "Carrefour (Dubai)", "item": "1L Milk", "price": 6.75, "currency": "AED", "city": "dubai"},
    {"source": "Carrefour (Dubai)", "item": "1kg Bread", "price": 5.25, "currency": "AED", "city": "dubai"},
]


async def scrape_prices(city_id: str) -> list[ScrapedPrice]:
    results = [
        ScrapedPrice(
            source=item["source"],
            item=item["item"],
            price=item["price"],
            currency=item["currency"],
            city=item["city"],
            url="#",
            scraped_at=datetime.utcnow(),
        )
        for item in MOCK_SCRAPED
        if item["city"] == city_id
    ]
    return results


async def scrape_all_prices() -> list[ScrapedPrice]:
    return [
        ScrapedPrice(
            source=item["source"],
            item=item["item"],
            price=item["price"],
            currency=item["currency"],
            city=item["city"],
            url="#",
            scraped_at=datetime.utcnow(),
        )
        for item in MOCK_SCRAPED
    ]
