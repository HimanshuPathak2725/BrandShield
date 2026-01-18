# BrandShield Enterprise: AI Crisis Response System

![BrandShield Enterprise](https://img.shields.io/badge/Status-Enterprise_Ready-blue) ![Python](https://img.shields.io/badge/Python-3.14-green) ![License](https://img.shields.io/badge/License-MIT-purple)

**BrandShield Enterprise** is an autonomous AI agent system designed to defend corporate brands from social media crises in real-time. It uses advanced RAG, Graph-based reasoning (LangGraph), and Predictive Analytics (Prophet/Transformers) to detect, analyze, and neutralize threats.

## ?? Key Enterprise Features

### 1. **Velocity Prediction Engine** ??
   - Forecasts the viral trajectory of a crisis before it explodes.
   - Uses **Facebook Prophet** for time-series forecasting.
   - Visualizes 'Crisis Velocity' on the dashboard.

### 2. **AI Action Center (Human-in-the-Loop)** ???
   - The AI drafts responses, but Humans approve them.
   - **Draft -> Approve -> Send** workflow.
   - Persistent state management using **SQLite**.

### 3. **Sentiment Grading with Transformers** ??
   - Uses 'roberta-base' (Transformer) for deep-learning-based sentiment analysis.
   - Falls back to VADER for high-throughput/low-latency scenarios.

### 4. **Enterprise Security Layer** ??
   - **JWT Authentication** for all API endpoints.
   - **Fernet Encryption** for audit logs (Action Center history).
   - 'Source Scoring' algorithm to rate domain credibility.

### 5. **Event-Driven Architecture** ?
   - Async API (Flask + Asyncio).
   - Thread-pooled Background Workers ('APScheduler').
   - Non-blocking RAG pipelines.

---

## ??? Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 16+ (for Frontend)

### 1. Install Dependencies
`ash
pip install -r requirements.txt
` 

### 2. Start the Backend API
`ash
# Windows
./start_api.ps1

# Linux/Mac
./start.sh
` 
The API runs on http://localhost:5000.

### 3. Start the Frontend Dashboard
`ash
cd frontend
npm install
npm start
` 
The Dashboard runs on http://localhost:3000.

---

## ??? Architecture Overview

`mermaid
graph TD
    A[Social Stream] -->|Ingest| B(Ingestion Agent)
    B -->|Score| C{Source Scorer}
    C -->|Trust Score| D[Data Lake]
    D -->|Analyze| E[Sentiment Transformer]
    D -->|Forecast| F[Velocity Predictor]
    E & F --> G[LangGraph Reasoning]
    G --> H[Response Generator]
    H --> I[Response Simulator]
    I --> J[Action Center UI]
    J -->|Human Approval| K[Social Platforms]
` 

## ?? Security & Compliance

- **Role-Based Access**: API tokens map to user roles.
- **Audit Trails**: All approvals are strictly logged and encrypted.
- **Tenant Isolation**: (Roadmap) Separation of data per client.

## ?? Contributing

Contact the DevSecOps team for access to the secure repository.

---

**© 2024 BrandShield AI**
