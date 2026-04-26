
# Application Manager

Application Manager is a web-based system designed to help students **track and manage their applications to international universities**.

The platform allows users to record application details, monitor status progression, and organize university-related information in a structured way.

The system targets students applying for **Bachelor's, Master's, and PhD programs abroad**.

---

# System Architecture

The system follows a **client–server architecture**.

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


backend/
  src/
    controllers/
    models/
    routes/
    middlewares/
    validators/
    configs/
    app.js

frontend/
  (React application)


## Responsibilities

- **Routes** → Define API endpoints
- **Controllers** → Validate input (using validators) and implement the backend business logic
- **Models** → Define database schema
- **Middlewares** → Handle authentication
- **Validators** → Validate request input
- **Configs** → Manage environment configuration

This separation improves **scalability, readability, and maintainability**.

---

# How to Run the Project

## 1. Clone the Repository
bash
git clone https://github.com/DaniBlaze1206/Application_Manager.git
cd Application_Manager

---

# Running the Backend

## 1. Navigate to the backend directory
bash
cd backend


## 2. Install dependencies
bash
npm install


## 3. Create environment file
Create a `.env` file inside the backend folder.

Example:

PORT=5000
MONGO_URI=mongodb://localhost:27017/Application_Manager
JWT_SECRET=your_secret_key
NODE_ENV=development


## 4. Start the backend server
bash
npm start


or if using nodemon:
bash
npm run dev


The backend server will run on:

http://localhost:5000


---

# Running the Frontend

## 1. Navigate to the frontend directory
bash
cd frontend


## 2. Install dependencies
bash
npm install


## 3. Start the development server
bash
npm run dev


The frontend will run on:

http://localhost:5173

Open the browser and navigate to that address.

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

Authorization: Bearer <token>


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

User (1) → (N) Applications


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

POST /api/auth/register

Request body:
json
{
  "username": "student123",
  "email": "student@email.com",
  "password": "password123",
  "confirmPassword": "password123"
}

---

### Login

POST /api/auth/login

Request body:
json
{
  "identifier": "email or username",
  "password": "password123"
}

Response includes JWT token.

---

# Application Routes (Protected)

All routes below require a valid **JWT token**.

---

### Create Application

POST /api/applications/create

Example request:
json
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

---

### Get Authenticated User's Applications

GET /api/applications/me

Returns all applications with applied filters belonging to the authenticated user.

---

### Filter Options

GET /api/applications/filters

Returns the options of the filter fields:
- country
- status
- application method

---

### Update Application

PATCH /api/applications/:id


---

### Delete Application

DELETE /api/applications/:id


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

The frontend is a **React single‑page application (SPA)** that communicates with the backend via its public REST API.

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
