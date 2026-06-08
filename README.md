# SupportDesk CRM

A production-ready Customer Support Ticketing CRM System built with React (Vite), Node.js, Express, and MongoDB Atlas.

## Tech Stack

**Frontend:** React 19, Vite, TypeScript, Material UI (MUI), React Router DOM, Axios, react-hot-toast  
**Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, dotenv, cors  
**Deployment:** Frontend → Vercel | Backend → Render | Database → MongoDB Atlas

---

## Features

- Create, view, update support tickets
- Auto-incrementing Ticket IDs (TKT-001, TKT-002...)
- Full-text search across ticket fields (debounced)
- Filter by status: Open / In Progress / Closed
- Sort by Latest / Oldest
- Pagination (10 per page)
- Dashboard analytics (Total, Open, In Progress, Closed)
- Recent Activity sidebar panel
- Notes/Comments timeline per ticket
- Dark mode (persisted in localStorage)
- Toast notifications (success/error)
- Skeleton loaders
- Confirmation dialog for closing tickets
- Fully responsive (mobile/tablet/desktop)

---

## Project Structure

```
datastraw/
├── backend/
│   ├── config/db.js
│   ├── controllers/ticketController.js
│   ├── models/Ticket.js
│   ├── models/Note.js
│   ├── routes/ticketRoutes.js
│   ├── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/api.js
    │   ├── App.tsx
    │   └── main.tsx
    ├── .env
    └── package.json
```

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Run Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### 1. Clone the repository

```bash
git clone <repo-url>
cd datastraw
```

### 2. Backend Setup

```bash
cd backend
npm install
# Configure your .env file (see above)
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
# Configure your .env file (see above)
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tickets` | Create a new ticket |
| GET | `/api/tickets` | Get all tickets (with search, filter, pagination, sort) |
| GET | `/api/tickets/activity` | Get 5 most recent tickets |
| GET | `/api/tickets/:ticketId` | Get single ticket with notes |
| PUT | `/api/tickets/:ticketId` | Update ticket status and/or add a note |

### Query Parameters for GET /api/tickets
- `?search=` — search across ticketId, name, email, subject, description
- `?status=Open|In Progress|Closed|All`
- `?page=1&limit=10`
- `?sort=latest|oldest`

---

## Deployment

### Backend → Render

1. Push backend code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set **Build Command:** `npm install`
4. Set **Start Command:** `node server.js`
5. Add environment variables: `PORT`, `MONGO_URI`

### Frontend → Vercel

1. Push frontend code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Set environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
4. Deploy — Vercel auto-detects Vite

### MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist `0.0.0.0/0` (all IPs) for Render compatibility
4. Copy the connection string to `MONGO_URI`
