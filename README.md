# Application Manager

Application Manager is a web-based system designed to help students **track and manage their applications to international universities**.

The platform allows users to record application details, monitor status progression, and organize university-related information in a structured way.

The system targets students applying for **Bachelor's, Master's, and PhD programs abroad**.

---

# System Architecture

The system follows a **clientâ€“server architecture**.

## Frontend
- Built as a **React single-page application (SPA)**
- Communicates with the backend via its **public REST API**
- Sends and receives **JSON over HTTP**

## Backend
- Built using **Node.js and Express**
- Provides **stateless REST endpoints**
- Uses **JWT authentication**

## Database
- **MongoDB**
- Stores persistent **user and application data**

## Architecture Model
- Stateless authentication
- Layered backend structure
- One-to-many relationship between users and applications

---

# Project Structure

```
backend/
  src/
    controllers/
    models/
    routes/
    middlewares/
    validators/
    configs/
    app.js
  server.js

frontend/
  (React application)
```

## Responsibilities

- **Routes** â†’ Define API endpoints
- **Controllers** â†’ Validate input (using validators) and implement the backend business logic
- **Models** â†’ Define database schema
- **Middlewares** â†’ Handle authentication
- **Validators** â†’ Validate request input
- **Configs** â†’ Manage environment configuration

This separation improves **scalability, readability, and maintainability**.

---

# How to Run the Project

## 1. Clone the Repository
```bash
git clone https://github.com/DaniBlaze1206/Application_Manager.git
cd Application_Manager
```

---

# Running the Backend

## 1. Navigate to the backend directory
```bash
cd backend
```

## 2. Install dependencies
```bash
npm install
```

## 3. Create environment file
Copy the example file and fill in your values:
```bash
cp .env.example .env
```
The `.env.example` file in the backend folder lists all required variables.

## 4. Start the backend server
```bash
npm start
```

or for local development with auto-restart:
```bash
npm run dev
```

The backend server will run on:
```
http://localhost:5000
```

---

# Running the Frontend

## 1. Navigate to the frontend directory
```bash
cd frontend
```

## 2. Install dependencies
```bash
npm install
```

## 3. Start the development server
```bash
npm run dev
```

The frontend will run on:
```
http://localhost:5173
```
Open the browser and navigate to that address.

---

# Running Tests

## 1. Navigate to the backend directory
```bash
cd backend
```

## 2. Run the test suite
```bash
npm test
```

Runs automated tests for authentication and application routes.

---

# Authentication System

Authentication is implemented using **JSON Web Tokens (JWT)**.

## Authentication Flow
1. User registers or logs in
2. Backend verifies credentials
3. Backend generates a signed JWT
4. Token is returned to the client
5. Client sends token in the `Authorization` header

Example header:
```
Authorization: Bearer <token>
```

## Token Details
- Contains: `userId`
- Expiration: **1 day**
- Signed using a **JWT secret stored in environment variables**

---

# Database Design

## User Collection
Stores authentication and identity information.

Fields:
- id (ObjectId)
- username (unique, required)
- email (unique, required)
- password (hashed, required)
- createdAt (Date)
- updatedAt (Date)

Design decisions:
- Unique constraints prevent duplicate accounts
- Passwords are securely hashed
- Timestamps support auditing and future analytics

---

## Application Collection
Stores university application records created by users.

Fields:
- id (ObjectId)
- userId (reference to User, required)
- universityName
- country
- programName
- contactEmail
- applicationMethod (EMAIL | PORTAL)
- applicationDate
- status (NOT_APPLIED | EMAIL_SENT | APPLIED_PORTAL | INTERVIEW | REJECTED | ACCEPTED)
- notes
- createdAt
- updatedAt

Relationship:
```
User (1) â†’ (N) Applications
```

Design decisions:
- Separate collections improve scalability
- `userId` enforces data ownership
- Enums ensure consistent data values
- `applicationDate` is independent from `createdAt`
- Default status is `NOT_APPLIED`

---

# Backend API Guide

## Authentication Routes (Public)

### Register User
```
POST /api/auth/register
```
Request body:
```json
{
  "username": "student123",
  "email": "student@email.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

---

### Login
```
POST /api/auth/login
```
Request body:
```json
{
  "identifier": "email or username",
  "password": "password123"
}
```
Response includes JWT token.

---

# Application Routes (Protected)

All routes below require a valid **JWT token**.

---

### Create Application
```
POST /api/application/create
```
Example request:
```json
{
  "universityName": "MIT",
  "country": "USA",
  "programName": "Computer Science",
  "contactEmail": "admissions@mit.edu",
  "applicationMethod": "PORTAL",
  "applicationDate": "2026-01-10",
  "status": "NOT_APPLIED",
  "notes": "Prepare recommendation letters"
}
```

---

### Get Authenticated User's Applications
```
GET /api/application/me
```
Returns all applications with applied filters belonging to the authenticated user.

---

### Filter Options
```
GET /api/application/filters
```
Returns options for filter fields such as:
- country
- status
- application method

---

### Update Application
```
PATCH /api/application/:id
```

---

### Delete Application
```
DELETE /api/application/:id
```

---

# Security Considerations
- Passwords are **securely hashed**
- JWT secret stored in **environment variables**
- Protected routes require **valid authentication**
- Application data always filtered by **userId**
- Server responses avoid exposing internal details

---

# Deployment Strategy

The backend is deployed as a **Node.js service** on a cloud hosting provider.

The frontend is a **React singleâ€‘page application (SPA)** that communicates with the backend via its public REST API.

## Environment variables in production
- Database connection string
- JWT secret
- Server port
- API base URL

## Production considerations
- Proper **CORS configuration**
- Secure storage of secrets
- **HTTPS enabled hosting**
- Safe error handling
