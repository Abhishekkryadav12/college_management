<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# College Complaint Management System

This project now includes a small Express backend for authentication, complaint data, and admin actions.

## Run locally

1. Install dependencies:
   `npm install`
2. Start the backend:
   `npm run server`
3. In a second terminal, start the frontend:
   `npm run dev`

The frontend will proxy `/api` requests to the Express server on port 5000.

## Backend endpoints

- `GET /api/health`
- `GET /api/students`
- `POST /api/auth/student`
- `POST /api/auth/admin`
- `POST /api/students/register`
- `GET /api/complaints`
- `GET /api/complaints/:id`
- `POST /api/complaints`
- `PATCH /api/complaints/:id/status`
