## Project Overview

The Application Manager is a web-based system designed to help students monitor and manage their applications to international universities.

This system allows users record application details, track status progression, and organize university-related information in a structured way.

They system target students applying for bachelor's, Master's and PhD abroad.

## System Architecture

The system follows the traditional client-server architecture.
Frontend:
- built using HTML, CSS and vanilla JavaScript.
- communicates with backend using REST API.
- sends and receives JSON over HTTP.

Backend:
- built with nodeJS and express.
- exposes stateless REST endpoints.
- uses JWT for authentication.

Database:
- MongoDB.
- stores persistent application and user data.

Architecture Model:

- stateless authentication.
- Layered backend structure.
- one-to-many relationship between users and applications.


## Database Design

User collection:
stores authentication and identity data

Fields: 
- id (ObjectId)
- username (unique, required)
- email (unique, required)
- password (hashed, required)
- createdAt (Date)
- updatedAt (Date)

Design Decisions:
- unique constraints prevent duplicate accounts.
- passwords are hashed for security.
- Timestamps support auditing and future analystics.
- Applications are not embedded to preserve scalability.

Application collection:
stores uiniversity application records created by users.

Fields:
- id (ObjectId)
- userId (reference to User, required)
- universityName (required)
- country (required)
- programName (required)
- contactEmail (optional)
- applicationMethod (enum: EMAIL | PORTAL)
- applicationDate (required)
- status (enum: NOT_APPLIED | EMAIL_SENT | APPLIED_PORTAL | INTERVIEW | REJECTED | ACCEPTED)
- notes (optional)
- createdAt (Date)
- updatedAt (Date)

Relationship:
	User (1) ---------> (N) Application

Design Decisions:
- separete collection improves scalability.
- userId enforce ownership.
- enums ensure consistent data.
- applicationDate is separate form createdAt.
- status defaults to NOT_APPLIED.

## Authentication & Security Design
The authentication method of the system is JSON Web Token (JWT).

Flow:

User logs in.
Backend verifies credentials.
Backend generates signed JWT.
Token returned to client.
Client sends token in authorization header.

Token :
	contains: userId
	ExpirationL: 1 day
	signed using enviroment secret

Security Decisions:
- Passwords are hashed.
- JWT secret stored in enviroment variables.
- All protected routes require valid token.
- userId expected from token (not from client).
- All application queries filtered by userId.

## API Design 

Authentication Routes (Public):
- POST /api/auth/register
- POST /api/auth/login

Application Routes (Protected):
- POST /api/applications
- GET /api/applications
- GET /api/applications/:id
- PUT /api/applications/:id
- DELETE api/applications/:id

Filtering routes examples:
- GET /api/applications?status=APPLIED
- GET /api/applications?country=Germany
- GET /api/applications?search=apply_program_name

Principles: 
- RESTful resource-based routing
- Stateless requests
- Ownership enforcement
- Consistent JSON responses


## Folder Structure:
backend structure:
	backend/
		- src/
			- controllers/
			- services/
			- models/
			- routes/ 
			- middlewares/
			- validators/
			- configs/
			- utils/
		- app.js
serparation of concerns:
- Routes define endpoints.
- Controllers handle validating receiving input using validators and return the output sevice.
- Services handles the business logic of the backend.
- Models define schema.
- Middleware handles authentication.
- Validators handle validation.
- Configs manage enviroment logic.
reason:
Improves scalability, readability and maintainability.

## Deployment Strategy

The backend will be deployed as a publicly accessible Node.js service using a cloud hosting provider. The service will run in a production environment with environment variables configured for sensitive values such as the database connection string and JWT secret.

The frontend will be served as static assets and will communicate with the deployed backend through its public REST API endpoint.

Environment Configuration:

The following values will be managed using environment variables:
- Database connection string
- JWT secret
- Server port
- Production API base URL

Production Considerations:

- CORS configuration to allow frontend-backend communication
- Secure storage of secrets
- Proper error handling without exposing internal details
- HTTPS-enabled hosting environment