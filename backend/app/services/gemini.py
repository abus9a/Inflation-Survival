import json
import re
from datetime import datetime
from app.config import settings
from app.models.schemas import AIRecommendation

FALLBACK_TIPS: dict = {
    "default": [
        "Buy groceries at local markets instead of supermarkets — save up to 30%.",
        "Use public transport instead of taxis for daily commutes.",
        "Cook at home 5 days a week, eat out only on weekends.",
        "Switch utilities to off-peak hours to reduce electricity bills.",
        "Use cashback apps and loyalty programs for everyday purchases.",
        "Buy seasonal produce — prices drop 40-60% in season.",
        "Compare prices across 3 stores before purchasing electronics.",
    ]
}


async def generate_recommendations(
    city: str,
    monthly_budget: float,
    expense_breakdown: dict,
) -> AIRecommendation:
    if settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai

            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash")

            breakdown_text = "\n".join(
                f"- {k}: ${v:.0f}/month" for k, v in expense_breakdown.items()
            )

            prompt = f"""You are a financial advisor specializing in cost-of-living optimization.

City: {city}
Monthly budget: ${monthly_budget:.0f}
Expense breakdown:
{breakdown_text}

Provide exactly 7 specific, actionable tips to reduce expenses by 20% in {city}.
Focus on local opportunities, apps, markets, and habits specific to this city.
Format your response as a JSON object with this structure:
{{
  "tips": ["tip1", "tip2", "tip3", "tip4", "tip5", "tip6", "tip7"],
  "priority_actions": ["action1", "action2", "action3"],
  "potential_savings_pct": 20
}}
Be specific, practical, and avoid generic advice."""

            response = await model.generate_content_async(prompt)
            text = response.text.strip()

            json_match = re.search(r"\{.*\}", text, re.DOTALL)
            if json_match:
                parsed = json.loads(json_match.group())
                savings_pct = parsed.get("potential_savings_pct", 20) / 100
                return AIRecommendation(
                    city=city,
                    monthly_budget=monthly_budget,
                    potential_savings=round(monthly_budget * savings_pct, 2),
                    savings_percentage=parsed.get("potential_savings_pct", 20),
                    tips=parsed.get("tips", FALLBACK_TIPS["default"]),
                    priority_actions=parsed.get("priority_actions", []),
                    generated_at=datetime.utcnow(),
                )
        except Exception:
            pass

    tips = FALLBACK_TIPS.get(city.lower(), FALLBACK_TIPS["default"])
    return AIRecommendation(
        city=city,
        monthly_budget=monthly_budget,
        potential_savings=round(monthly_budget * 0.20, 2),
        savings_percentage=20.0,
        tips=tips,
        priority_actions=tips[:3],
        generated_at=datetime.utcnow(),
    )
