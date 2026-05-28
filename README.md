# FinWise 💼

**Automated Invoice & Transaction Reconciliation Platform**

FinWise is an enterprise-grade SaaS application that intelligently automates invoice and bank transaction reconciliation using advanced OCR and LLM-based parsing. It streamlines financial workflows by allowing users to upload receipts and bank statements, extracting structured data, and automatically matching transactions with a custom scoring engine.

---

## ✨ Features

- **Receipt & Document Processing**: Upload and process receipts and bank statements with intelligent file handling
- **OCR-Powered Text Extraction**: Extract raw text from receipt images using advanced OCR technology
- **LLM-Based Parsing**: Intelligent field extraction and normalization using large language models
- **Custom Scoring Engine**: Proprietary matching algorithm that intelligently correlates receipts to bank transactions
- **Structured Data Storage**: Persistent storage of receipts, transactions, and match results
- **Real-Time Dashboard**: Interactive Next.js dashboard displaying matching status, confidence scores, and reconciliation summaries
- **RESTful API**: Comprehensive API endpoints for programmatic access

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (structured data)
- **File Storage**: Supabase Storage (receipt files)
- **File Uploads**: Multer
- **OCR**: OCR Library (raw text extraction)
- **LLM Integration**: Custom LLM-based parsing pipeline
- **Deployment**: Render

### Key Architecture Components
- **Receipt Processing Pipeline**: Handles document ingestion, OCR extraction, and LLM-based field parsing
- **Matching Engine**: Custom scoring system for transaction-receipt correlation
- **Data Layer**: PostgreSQL for normalized structured data with Supabase for file management

---

## 📁 Repository Structure

```
Finwise/
├── backend/
│   ├── src/
│   │   ├── controllers/           # API request handlers
│   │   ├── models/                # Database models (receipts, transactions, matches)
│   │   ├── routes/                # API endpoint definitions
│   │   ├── services/              # Business logic (OCR, LLM, matching engine)
│   │   ├── app.js                 # Express app configuration
│   │   └── server.js              # Server entry point
│   ├── package.json
│   └── .env (not committed)
│
├── frontend/
│   ├── src/
│   │   ├── api/                   # API client utilities
│   │   ├── components/            # Reusable React components
│   │   ├── pages/                 # Route pages
│   │   ├── App.jsx                # Main app component
│   │   └── main.jsx               # React entry point
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- Supabase account (for file storage)
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhnish/Finwise.git
   cd Finwise
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Configure .env with database and Supabase credentials
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 🏗️ System Architecture

### Receipt Processing Pipeline
1. **File Upload**: Users upload receipt images or PDF documents
2. **OCR Extraction**: Optical Character Recognition extracts raw text from documents
3. **LLM Parsing**: Large Language Model intelligently normalizes and extracts structured fields:
   - Vendor name
   - Amount
   - Date
   - Category
   - Additional metadata
4. **Data Persistence**: Structured data stored in PostgreSQL, files archived in Supabase Storage

### Transaction Matching Engine
- **Scoring Algorithm**: Custom scoring system evaluates receipt-transaction pairs across:
  - Amount matching (fuzzy tolerance)
  - Date proximity
  - Vendor name similarity
  - Category alignment
- **Confidence Metrics**: Each match includes confidence score for user review
- **Results**: Matches surfaced in real-time dashboard with detailed reconciliation view

---

## 🎯 Design Decisions

- **Stateless Backend**: Horizontal scalability and simplified deployment
- **Environment-Based Configuration**: Flexible deployment across environments
- **Clear Separation of Concerns**: Distinct frontend/backend/storage layers
- **Advanced Matching Logic**: ML-powered scoring vs. simple rule-based MVP approach
- **Production Stability**: Focus on reliability, error handling, and data integrity
- **Database Choice**: PostgreSQL for ACID compliance and complex queries; Supabase for scalable file storage

---

## 📊 Future Enhancements

- **User Authentication**: Multi-user accounts with role-based access control
- **Advanced Analytics**: Spending patterns, vendor tracking, budget analytics
- **Enhanced OCR**: Support for invoices in multiple languages
- **ML Model Optimization**: Continuous learning from user corrections
- **Multi-Tenant Support**: Complete SaaS platform capabilities
- **API Rate Limiting**: Quota management for API consumers
- **Webhook Integrations**: Real-time notifications and third-party integrations
- **Audit Logging**: Complete transaction audit trails

---

## 👨‍💻 Author

**Abhnish Kumar**

- GitHub: [@abhnish](https://github.com/abhnish)
- Project: [FinWise](https://github.com/abhnish/Finwise)

---

## 📄 License

This project is for educational and demonstration purposes.

---

## 📞 Support

For issues, questions, or contributions, please open an issue on the [GitHub repository](https://github.com/abhnish/Finwise/issues).
