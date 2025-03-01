from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import cities, prices, forecast, exchange, recommendations

app = FastAPI(
    title="Inflation Survival Platform",
    description="Track prices, compare cities, and forecast inflation trends.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cities.router, prefix="/api/cities", tags=["Cities"])
app.include_router(prices.router, prefix="/api/prices", tags=["Prices"])
app.include_router(forecast.router, prefix="/api/forecast", tags=["Forecast"])
app.include_router(exchange.router, prefix="/api/exchange", tags=["Exchange"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["AI"])


@app.get("/")
async def root():
    return {"status": "ok", "service": "Inflation Survival Platform API"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
