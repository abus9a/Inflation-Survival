# Inflation Survival Platform

A web platform for tracking the cost of living, comparing cities, and forecasting inflation. It helps you understand how much life costs in different cities, how prices are likely to change, and where you can save money.

## Features

- **Cost of Living Dashboard** — housing, groceries, transport, utilities and other expenses per city, with an interactive city map and exchange rates.
- **City Comparison** — side-by-side comparison of two cities across all expense categories: see how much you'd save (or lose) by relocating.
- **Price Forecasting** — 12-month forecasts per category (groceries, rent, restaurants, transport, utilities, healthcare) using polynomial regression (scikit-learn).
- **AI Recommendations** — personalized cost-cutting tips from Google Gemini based on the city and your budget. Falls back to built-in tips when no API key is set.
- **Exchange Rates** — rates against USD (KZT, TRY, EUR, AED, THB, PLN, RUB, GBP, JPY, CNY).

Supported cities: Astana, Almaty, Istanbul, Berlin, Dubai, Bangkok, Warsaw, Moscow.

> **Note:** cost-of-living data, store prices, and exchange rates are currently demo (mock) data, and the price history used for forecasting is generated synthetically.

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Recharts, Leaflet / React-Leaflet, lucide-react |
| Backend | FastAPI, Pydantic v2, Uvicorn |
| ML | scikit-learn, NumPy, pandas |
| AI | Google Gemini (`google-generativeai`, `gemini-1.5-flash` model) |

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI entry point, CORS, router registration
│   │   ├── config.py          # settings (.env)
│   │   ├── api/routes/        # cities, prices, forecast, exchange, recommendations
│   │   ├── models/schemas.py  # Pydantic schemas
│   │   └── services/          # city data, scraper, exchange rates, ML forecast, Gemini
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── app/                   # pages: /, /dashboard, /compare, /forecast
    ├── components/            # charts, map, tables, widgets
    ├── lib/api.ts             # backend API client
    └── types/                 # TypeScript types
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # set your GEMINI_API_KEY
uvicorn app.main:app --reload --port 8000
```

The API runs at http://localhost:8000, with interactive Swagger docs at http://localhost:8000/docs.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app opens at http://localhost:3000.

## Environment Variables

**backend/.env**

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key ([get one](https://aistudio.google.com/app/apikey)). Optional — without it, AI recommendations use a built-in set of tips. |

**frontend/.env.local** (optional)

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API URL |

> The backend only allows CORS from `http://localhost:3000` and `http://127.0.0.1:3000`. If you run the frontend elsewhere, update `allow_origins` in [backend/app/main.py](backend/app/main.py).

## API

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/cities/` | Cost of living for all cities |
| GET | `/api/cities/ids` | List of city IDs |
| GET | `/api/cities/{city_id}` | Cost of living for a city |
| GET | `/api/prices/` | Item prices for all cities |
| GET | `/api/prices/{city_id}` | Item prices for a city |
| GET | `/api/forecast/{city_id}` | Forecasts for all categories in a city |
| GET | `/api/forecast/{city_id}/{category}` | Forecast for a single category |
| GET | `/api/exchange/` | Exchange rates against USD |
| GET | `/api/recommendations/{city_id}` | AI recommendations for a city |
| POST | `/api/recommendations/` | AI recommendations for a given budget |

`city_id`: `astana`, `almaty`, `istanbul`, `berlin`, `dubai`, `bangkok`, `warsaw`, `moscow`
`category`: `groceries`, `rent`, `restaurants`, `transport`, `utilities`, `healthcare`

Example request:

```bash
curl -X POST http://localhost:8000/api/recommendations/ \
  -H "Content-Type: application/json" \
  -d '{"city": "almaty", "monthly_budget": 900}'
```

## Roadmap

- Connect real data sources (Numbeo, an exchange rate API, store scraping)
- Store historical prices in a database and train forecasts on real data
- Add more cities
