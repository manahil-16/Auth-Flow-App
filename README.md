# Auth Flow App

A full-stack authentication system built with React and Node/Express, featuring secure JWT-based login, protected routes, and a task management dashboard.

## Overview

This project demonstrates a complete authentication flow: user signup with client-side validation, secure password hashing, JWT issuance via httpOnly cookies, protected page routing, and clean session logout. It includes a functional dashboard with a task tracker (add, complete, filter, delete) to showcase authenticated data persistence per user.

## Features

- **Signup & Login** — client-side validation (required fields, 8+ character password, email format)
- **Secure authentication** — passwords hashed with bcrypt, JWT issued on login/signup
- **httpOnly cookie storage** — token is never exposed to client-side JavaScript, protecting against XSS token theft
- **Protected routes** — unauthenticated users are redirected to `/login` when visiting `/dashboard`
- **Logout** — clears the session cookie server-side
- **Task dashboard** — add tasks with priority levels, mark complete, filter by status, live progress stats

## Tech Stack

**Frontend:** React (Vite), React Router, Axios
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, cookie-parser, CORS

## Project Structure

```
auth-flow-app/
├── server/               # Express backend
│   ├── models/User.js    # User schema with password hashing
│   ├── middleware/auth.js# JWT verification middleware
│   ├── routes/auth.js    # Signup, login, logout, /me endpoints
│   └── index.js          # Server entry point
└── client/               # React frontend
    ├── src/context/      # AuthContext (global auth state)
    ├── src/components/   # ProtectedRoute wrapper
    └── src/pages/        # Signup, Login, Dashboard
```

## Getting Started

### Prerequisites
- Node.js installed
- A MongoDB connection (local instance or MongoDB Atlas)

### Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in `server/`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
```
Run the server:
```bash
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```
Visit `http://localhost:5173`

## Auth Flow

1. **Signup** → validated on client, password hashed on server, JWT issued as httpOnly cookie
2. **Login** → credentials verified, JWT re-issued and stored the same way
3. **Protected page** → `/dashboard` checks auth state via `/api/auth/me`; unauthenticated users are redirected to `/login`
4. **Logout** → cookie cleared server-side, user state reset on client
5. **Blocked access** → visiting `/dashboard` directly while logged out redirects to `/login`

