# Expense Tracker

A modern, production-ready full-stack personal finance application designed with robust authentication, dynamic glassmorphism UI, and highly scalable data mappings.

## Features
- **Stateless Secure Authentication**: End-to-end sessions managed safely via `JWT` tracking and `Bcrypt` 10-layer standard encryptions.
- **Glassmorphism Frontend UI**: A highly responsive, modular React application using elegant vanilla CSS styling.
- **Data Robustness**: Guaranteed unique backend insertion architectures implementing `$POST x-idempotency-key` tracking protocols against PostgreSQL ensuring network retries do not duplicate constraints. 
- **Type Validations**: Absolute perimeter bounds mapped via strict `Zod` implementations natively rejecting bad strings, astronomical values bounding and blocking Javascript memory overflow errors entirely.

## Tech Stack
- **Frontend**: React.js, TypeScript, Vite
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Neon Tech)
- **Security**: Zod (Validation), Bcrypt (Hashing), JsonWebToken (Sessions)

## Setup & Local Development

### 1. Database Configuration
This app uses a PostgreSQL database. Ensure you have your PostgreSQL string mapped. Setup your local Environment Variables by mirroring the following inside `/backend/.env`:
```env
DATABASE_URL=postgresql://[user]:[password]@[host]/[dbname]?sslmode=require
PORT=5000
JWT_SECRET=super_secret_jwt_key_123
```

### 2. Backend Initialization
The Express framework natively handles all API schemas.
```bash
cd backend
npm install
npm start
```
*Note: The backend will automatically scaffold your base `users` and `expenses` tables on startup inside db.js!*

### 3. Frontend Initialization 
The client-side operates on fully isolated React components smoothly connecting to the backend via modular variables.
```bash
cd frontend
npm install
npm run dev
```

## Deployment Notes
Prior to deploying to cloud providers (e.g. Vercel for Frontend and Render/Heroku for Backend), navigate to `frontend/src/api.ts` and ensure your `API_BASE` is cleanly mapped towards your live securely hosted express backend endpoint (instead of the `localhost:5000` default tracking variable!).
