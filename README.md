# CRIM — Customer Churn Risk Identification and Management System

A web-based application that uses machine learning and explainable AI to predict customer churn risk and help businesses take proactive retention decisions.

---

## Description

Customer churn (i.e., the rate at which customers stop doing business with a company) is a major challenge for subscription-based businesses. CRIM addresses this by analyzing historical customer data, predicting the probability of churn for each customer, and categorizing them into risk levels. The system also explains *why* a customer is at risk, making the predictions transparent and trustworthy.

---

## Team Members

- Adeela Nasir (23L-0823)
- Hajirah (23L-0929)
- Sundas Habib (23L-2580)

---

## Features

- **CSV Data Upload** — Upload structured customer datasets for analysis
- **Churn Prediction Engine** — XGBoost Model calculates churn probability per customer
- **Risk Categorization** — Automatically groups customers into Low, Medium, or High risk
- **Explainability (XAI)** — SHAP-based feature importance to explain predictions
- **Customer Profile View** — Detailed view of individual customer attributes and risk factors
- **Search & Filtering** — Filter customers by risk level, tenure, contract type, and more
- **Churn Summary Dashboard** — Overview of total customers, churn rate, and risk distribution
- **Report Generation** — Export results easily as Excel file

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite) |
| Backend | FastAPI (Python) |
| Machine Learning | Scikit-learn, SHAP |
| Data Processing | Pandas, NumPy |
| Visualization | Recharts, Matplotlib, Seaborn |
| Database | MongoDB |
| Export | OpenPyXL, ReportLab |

---

## Project Structure

```
CRIM/
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── deps.py                 # Authentication dependencies
│   │   │   └── security.py             # JWT hashing & security utilities
│   │   │
│   │   ├── db/
│   │   │   ├── crud.py                 # Database CRUD operations
│   │   │   └── database.py             # Database connection setup
│   │   │
│   │   ├── ml/
│   │   │   ├── preprocess.py           # Data cleaning & encoding
│   │   │   ├── model.py                # Load trained ML model
│   │   │   ├── predict.py              # Churn prediction logic
│   │   │   ├── recommendations.py      # Retention strategy generation
│   │   │   └── shap_explainer.py       # SHAP explainability analysis
│   │   │   └── contact.py              # Contact form
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.py                 # Authentication endpoints
│   │   │   ├── evaluate.py             # Model evaluation endpoints
│   │   │   ├── recommendations.py      # Recommendation endpoints
│   │   │   └── upload.py               # CSV upload endpoints
│   │   │
│   │   └── main.py                     # FastAPI application entry point
│   │
│   ├── models/
│   │   ├── churn_model.pkl             # Trained XGBoost churn model
│   │   ├── feature_columns.pkl         # Saved feature column mappings
│   │   └── users.py                    # User model/schema
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js                 # Authentication API calls
│   │   │   └── recommendation.js       # Recommendation API integration
│   │   │
│   │   ├── components/
│   │   │   ├── CustomerModal.jsx       # Customer detail modal
│   │   │   ├── CustomerTable.jsx       # Customer data table
│   │   │   ├── ExportReport.jsx        # PDF/Excel export component
│   │   │   ├── FileUpload.jsx          # CSV upload component
│   │   │   └── NavBar.jsx              # Navigation bar
│   │   │
│   │   ├── pages/
│   │   │   ├── Customers.jsx           # Customer management page
│   │   │   ├── Dashboard.jsx           # Analytics dashboard
│   │   │   ├── Home.jsx                # Landing page
│   │   │   ├── Login.jsx               # Login page
│   │   │   ├── Reports.jsx             # Reports & exports page
│   │   │   ├── Signup.jsx              # User registration page
│   │   │   └── Moelinsights.jsx        # Insights about our model
│   │   │   └── Reset Password.jsx      # Forgot Password page
│   │   │   └── Uploads.jsx             # Dataset upload page
│   │   │   └── VerifyEmail.jsx         # Email Verification page
│   │   │
│   │   ├── main.jsx
│   │   └── App.jsx
│   │
│   ├── public/
│   └── package.json
│
├── docs/
│   ├── iteration1.docx
│   ├── iteration2.docx
│   └── iteration3.docx
│
├── notebooks/
│   ├── model_training.ipynb
│   ├── data/
│   │   └── telco_churn.csv             # Kaggle Telco churn dataset
│   │
│   └── testDatasets/
│       ├── test_dataset_1.csv
│       ├── test_dataset_2.csv
│       └── test_dataset_3.csv
│
├── README.md
└── .gitignore
```

---

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+

### Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173` and the API at `http://localhost:8000`.

---

## Dataset

This project uses the Telco Customer Churn dataset sourced from Kaggle. It includes attributes such as customer tenure, service subscriptions, monthly charges, total charges, contract type, and churn labels.

---

## Development Plan

The project is built across 3 iterations:

| Iteration | Focus | Deliverable |
|-----------|-------|-------------|
| 1 | Core Prediction Module | Working churn prediction with basic dashboard |
| 2 | Analysis & Interaction Module | Customer profiles, XAI, filtering |
| 3 | Reporting & Finalization | Export, UI polish, testing, documentation |

---

## AI Techniques Used

- Supervised Machine Learning (Classification)
- Explainable AI (XAI) using SHAP values
- Predictive Analytics
- Feature Importance Analysis
- Retention Strategies Recommendations
---

## Authors

- [S-undas](https://github.com/S-undas)
- [adeela6](https://github.com/adeela6)
- [Hajirayyy](https://github.com/Hajirayyy)