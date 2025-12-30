import numpy as np
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from app.models.schemas import PriceForecast, ForecastPoint

CATEGORY_BASE_PRICES: dict = {
    "astana": {
        "groceries": 132, "rent": 395, "restaurants": 88,
        "transport": 26, "utilities": 77, "healthcare": 44,
    },
    "almaty": {
        "groceries": 154, "rent": 505, "restaurants": 110,
        "transport": 33, "utilities": 88, "healthcare": 55,
    },
    "istanbul": {
        "groceries": 142, "rent": 320, "restaurants": 89,
        "transport": 21, "utilities": 44, "healthcare": 27,
    },
    "berlin": {
        "groceries": 302, "rent": 1458, "restaurants": 238,
        "transport": 97, "utilities": 184, "healthcare": 54,
    },
    "dubai": {
        "groceries": 300, "rent": 1770, "restaurants": 245,
        "transport": 109, "utilities": 150, "healthcare": 95,
    },
    "bangkok": {
        "groceries": 218, "rent": 490, "restaurants": 136,
        "transport": 41, "utilities": 68, "healthcare": 33,
    },
    "warsaw": {
        "groceries": 268, "rent": 780, "restaurants": 183,
        "transport": 34, "utilities": 146, "healthcare": 49,
    },
    "moscow": {
        "groceries": 192, "rent": 480, "restaurants": 157,
        "transport": 26, "utilities": 70, "healthcare": 44,
    },
}

INFLATION_RATES: dict = {
    "astana": 0.085, "almaty": 0.092, "istanbul": 0.45,
    "berlin": 0.032, "dubai": 0.021, "bangkok": 0.041,
    "warsaw": 0.058, "moscow": 0.074,
}


def _generate_historical(base_price: float, annual_rate: float, months: int = 24) -> np.ndarray:
    monthly_rate = (1 + annual_rate) ** (1 / 12) - 1
    rng = np.random.default_rng(seed=42)
    prices = []
    price = base_price / (1 + monthly_rate) ** months
    for _ in range(months):
        noise = rng.normal(0, base_price * 0.015)
        seasonal = base_price * 0.02 * np.sin(_ * np.pi / 6)
        price = price * (1 + monthly_rate) + noise + seasonal
        prices.append(max(price, base_price * 0.5))
    return np.array(prices)


def generate_forecast(city_id: str, category: str) -> PriceForecast:
    city_prices = CATEGORY_BASE_PRICES.get(city_id, CATEGORY_BASE_PRICES["astana"])
    current_price = city_prices.get(category, city_prices["groceries"])
    annual_rate = INFLATION_RATES.get(city_id, 0.05)
    monthly_rate = (1 + annual_rate) ** (1 / 12) - 1

    historical = _generate_historical(current_price, annual_rate, 24)

    X = np.arange(24).reshape(-1, 1)
    poly = PolynomialFeatures(degree=2)
    X_poly = poly.fit_transform(X)
    model = LinearRegression()
    model.fit(X_poly, historical)

    future_X = np.arange(24, 24 + 12).reshape(-1, 1)
    future_X_poly = poly.transform(future_X)
    predictions = model.predict(future_X_poly)

    residuals = historical - model.predict(X_poly)
    std_err = np.std(residuals)

    base_date = datetime.utcnow() - timedelta(days=730)
    data_points: list[ForecastPoint] = []

    for i, val in enumerate(historical):
        date = (base_date + timedelta(days=30 * i)).strftime("%Y-%m")
        data_points.append(ForecastPoint(
            date=date,
            actual=round(float(val), 2),
            predicted=round(float(val), 2),
            lower_bound=round(float(val) * 0.95, 2),
            upper_bound=round(float(val) * 1.05, 2),
        ))

    for i, pred in enumerate(predictions):
        date = (datetime.utcnow() + timedelta(days=30 * i)).strftime("%Y-%m")
        confidence_factor = 1 + i * 0.02
        data_points.append(ForecastPoint(
            date=date,
            actual=None,
            predicted=round(float(pred), 2),
            lower_bound=round(float(pred) - std_err * confidence_factor * 1.96, 2),
            upper_bound=round(float(pred) + std_err * confidence_factor * 1.96, 2),
        ))

    forecast_3m = float(predictions[2])
    forecast_6m = float(predictions[5])
    forecast_12m = float(predictions[11])

    growth_12m = (forecast_12m - current_price) / current_price * 100
    trend = "rising" if growth_12m > 5 else "falling" if growth_12m < -2 else "stable"

    return PriceForecast(
        city=city_id,
        category=category,
        currency="USD",
        current_price=round(current_price, 2),
        forecast_3m=round(forecast_3m, 2),
        forecast_6m=round(forecast_6m, 2),
        forecast_12m=round(forecast_12m, 2),
        inflation_rate=round(annual_rate * 100, 1),
        trend=trend,
        data_points=data_points,
    )
