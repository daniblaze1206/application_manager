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
