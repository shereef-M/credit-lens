from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title="CrediLens Risk API")

model = joblib.load("../models/logistic_regression.pkl")
scaler = joblib.load("../models/scaler.pkl")
feature_names = joblib.load("../models/feature_names.pkl")

class LoanApplication(BaseModel):
    loanamount: float
    loannumber: int
    totaldue: float
    termdays: int
    prev_loan_count: float
    avg_days_early_late: float
    max_days_late: float
    avg_loanamount: float
    was_referred: int
    has_demographics: int
    longitude_gps: float
    latitude_gps: float
    bank_account_type: str
    bank_name_clients: str
    employment_status_clients: str


@app.get("/")
def root():
    return {"status": "CrediLens API is running"}

@app.post("/predict")
def predict(application: LoanApplication):
    input_df = pd.DataFrame([application.model_dump()])
    input_encoded = pd.get_dummies(input_df, columns=["bank_account_type", "bank_name_clients", "employment_status_clients"])
    input_encoded = input_encoded.reindex(columns=feature_names, fill_value=0)
    input_scaled = scaler.transform(input_encoded)

    risk_score = model.predict_proba(input_scaled)[0][1]
    prediction = "Bad" if risk_score >= 0.5 else "Good"

    # Compute each feature's contribution to this specific prediction
    contributions = input_scaled[0] * model.coef_[0]
    feature_contributions = list(zip(feature_names, contributions))
    feature_contributions.sort(key=lambda x: abs(x[1]), reverse=True)

    top_factors = []
    for name, contribution in feature_contributions[:3]:
        direction = "increased" if contribution > 0 else "decreased"
        top_factors.append({
            "feature": name,
            "effect": direction,
        })

    return {
        "prediction": prediction,
        "risk_score": round(float(risk_score), 4),
        "top_factors": top_factors,
    }