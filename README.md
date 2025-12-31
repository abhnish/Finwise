FinWise 💼

Automated Invoice & Transaction Reconciliation Platform

FinWise is a full-stack SaaS application that automates invoice and bank transaction reconciliation. It allows users to upload invoice PDFs, manage transactions, and automatically match invoices with corresponding transactions, reducing manual accounting effort.

🔗 Live Demo

Frontend: https://finwise-jpbo4xuy6-abhnishs-projects.vercel.app/

Backend API: https://finwise-tu8p.onrender.com/

 Features

Upload and parse invoice PDFs

Store and manage invoices & transactions

Automated invoice–transaction matching

Matching status and summary dashboard

RESTful API architecture

Fully deployed cloud application

 Tech Stack
1. Frontend

2. React (Vite)

3. Tailwind CSS

4. Axios

5. React Router

6. Deployed on Vercel

Backend

1. Node.js

2. Express.js

3. MongoDB (Atlas)

4. Mongoose

5. Multer (file uploads)

6. pdf-parse (PDF extraction)

7. Deployed on Render

Repository Structure

Finwise/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env (not committed)
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env
│
└── README.md

Clone Repository 

git clone https://github.com/abhnish/Finwise.git
cd Finwise

cd backend
npm install

cd ../frontend
npm install

Design Decisions

Stateless backend for scalability

Environment-based configuration

Clear separation of frontend and backend

Simple matching logic for MVP (can be enhanced later)

Focus on production stability over experimental features

 Future Enhancements

Authentication & user accounts

Advanced AI/ML matching logic

OCR-based invoice extraction

Analytics dashboard

Multi-tenant support

Role-based access control
