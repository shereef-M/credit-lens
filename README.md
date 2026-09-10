# credit-lens

# CrediLens

**Alternative credit risk scoring for Nigerian digital lenders.**

Live app: https://credit-lens-omega.vercel.app

## The Problem

Nigeria's digital lending market disbursed an estimated $2.1B in 2025, with over 520 licensed lenders competing for borrowers who often have no formal credit history. Many smaller lenders don't report to a credit bureau, leaving them to either over-lend to bad risks or exclude good "thin-file" borrowers who would have repaid reliably. Rising defaults in this space have been flagged as a financial stability concern.

## The Solution

CrediLens is a lightweight risk-screening tool for loan officers. Given an applicant's loan details and repayment history, it returns:

- A default-risk classification (Good / Bad)
- A risk score (0–1)
- **Explainable reason codes** — the top factors driving that specific prediction, computed directly from the model's own coefficients rather than approximated after the fact

## Architecture

React (Vercel) - Express + MongoDB (Render) - FastAPI ML service (Render)

- **ML service**: Python, scikit-learn, FastAPI. Trained on the Data Science Nigeria / SuperLender loan default dataset (via Zindi).
- **Backend**: Express + MongoDB Atlas. Stores applications and scoring results.
- **Frontend**: React (Vite), React Router.

## Model

Five classifiers were trained and compared on the minority ("Bad"/default) class, since accuracy alone is misleading on this ~78/22 imbalanced dataset:

Model | Recall (Bad) | F1 (Bad)
**Logistic Regression** | **0.62** | **0.45**
SVM | 0.55 | 0.43
Random Forest | 0.42 | 0.41
Decision Tree | 0.35 | 0.31
kNN | 0.19 | 0.27

Logistic Regression was selected it caught the most actual defaulters, and its linear coefficients allow every individual prediction to be decomposed into per-feature contributions, powering the reason-codes feature.

## Known Limitations

- GPS coordinates are included as available features but are not intended as meaningful risk drivers on their own; they can appear in reason codes due to dataset correlation rather than genuine causal relevance. Future work would exclude or geo-bucket them.
- The model is calibrated on short-term digital loans (15–90 day terms); predictions on inputs far outside this range (e.g. unusually long terms) are extrapolations and should be treated with caution.
- This is a decision-support demo, not a production credit bureau or regulated lending decision system.

## Local Setup

**ML API**
cd api
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

**Backend**
cd server
npm install
npm run dev

**Frontend**
cd client
npm install
npm run dev

Each service needs its own `.env` (see `.env.example` patterns in each folder) — `MONGO_URI`, `ML_API_URL`, `VITE_API_URL`.

## Dataset

Trained on the Data Science Nigeria Loan Default Prediction dataset via [Zindi](https://zindi.africa/competitions/data-science-nigeria-challenge-1-loan-default-prediction). Raw data is not included in this repo per Zindi's competition terms — download it directly from Zindi to reproduce training.

## Built For

ML Empowerment Build Challenge 3.0 (Devpost)
