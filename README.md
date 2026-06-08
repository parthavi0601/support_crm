# SupportDesk CRM (Advanced Edition)

A production-ready Customer Support Ticketing CRM System built with React (Vite), Node.js, Express, and MongoDB Atlas. 

This repository includes advanced CRM features like **Priority Management**, **Activity Timelines**, **Ticket Assignment**, and an **Analytics Dashboard**.

---

## 🌟 Features

- **Ticket Creation**: Easily create support tickets with standard details plus configurable priorities and optional agent assignment.
- **Search & Filtering**: Full-text search across all fields and powerful filters for Status, Priority, and Assigned Agent.
- **Priority Management**: Tag tickets with Low, Medium, High, or Critical priorities. Priority-based sorting (Critical first).
- **Ticket Assignment**: Delegate support requests by assigning tickets directly to specific team members (Agents).
- **Activity Timeline**: A comprehensive logging system that automatically tracks every lifecycle event (creation, status changes, priority changes, reassignment, and new notes) displayed in a beautiful vertical timeline.
- **Analytics Dashboard**: Get instant insights using interactive Recharts displaying Ticket Status Distribution, Priority Distribution, Agent Workloads, and a 14-day Creation Trend.

---

## 🛠 Architecture & Tech Stack

**Frontend:**
- **Framework**: React 19 + TypeScript + Vite
- **UI Library**: Material UI (MUI v6)
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Networking**: Axios
- **Notifications**: react-hot-toast

**Backend:**
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB Atlas via Mongoose
- **Config**: dotenv, cors

---

## 🗄 Database Schema

We utilize three core Mongoose Models to structure data efficiently:

### `Ticket Model`
- `ticketId` (String, Unique, Auto-generated)
- `customerName` (String)
- `customerEmail` (String)
- `subject` (String)
- `description` (String)
- `status` (Enum: 'Open', 'In Progress', 'Closed' | Default: 'Open')
- `priority` (Enum: 'Low', 'Medium', 'High', 'Critical' | Default: 'Medium')
- `assignedTo` (String | Default: 'Unassigned')
- `createdAt` & `updatedAt` (Timestamps)

### `Note Model`
- `ticketId` (String, Reference to Ticket)
- `noteText` (String)
- `createdAt` & `updatedAt` (Timestamps)

### `Activity Model`
- `ticketId` (String, Reference to Ticket)
- `actionType` (Enum: 'TICKET_CREATED', 'STATUS_CHANGED', 'PRIORITY_CHANGED', 'NOTE_ADDED', 'ASSIGNMENT_CHANGED')
- `description` (String)
- `createdAt` & `updatedAt` (Timestamps)

---

## 📡 API Documentation

### `POST /api/tickets`
Create a new ticket. Auto-generates the ticket ID and logs a `TKT-CREATED` activity.
- **Body**: `{ customerName, customerEmail, subject, description, priority, assignedTo }`
- **Response**: `{ ticketId, createdAt }`

### `GET /api/tickets`
Fetch all tickets with pagination, search, and filtering.
- **Query Params**: `?search=&status=Open&priority=Critical&assignedTo=John&sort=priority&page=1&limit=10`
- **Response**: `{ tickets: [...], stats: {...}, pagination: {...} }`

### `GET /api/tickets/:ticketId`
Fetch complete details for a single ticket, including its full Note history and Activity Timeline.
- **Response**: `{ ticketId, subject, status, priority, assignedTo, notes: [...], activities: [...] }`

### `PUT /api/tickets/:ticketId`
Update a ticket's status, priority, or assignment, and optionally add a new note. Auto-generates corresponding activity logs for any changed fields.
- **Body**: `{ status, priority, assignedTo, note }`
- **Response**: `{ success: true }`

### `GET /api/analytics`
Fetch aggregate analytics data for the dashboard.
- **Response**: `{ totalTickets, openTickets, criticalTickets, statusDistribution, priorityDistribution, agentWorkload, ticketCreationTrend, ... }`

---

## 📸 Screenshots

*(Replace these placeholder links with actual screenshots of your deployed app)*

- **Dashboard**: `[Dashboard Screenshot]`
- **Ticket Details**: `[Ticket Details Screenshot]`
- **Activity Timeline**: `[Activity Timeline Screenshot]`
- **Analytics Dashboard**: `[Analytics Dashboard Screenshot]`

---

## 🚀 Deployment Instructions

### Backend → Render

1. Push backend code to GitHub.
2. Create a new **Web Service** on [render.com](https://render.com).
3. Set **Build Command:** `npm install`
4. Set **Start Command:** `node server.js`
5. Add environment variables:
   - `PORT`: `5000`
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/support_crm?retryWrites=true&w=majority`

### Frontend → Vercel

1. Push frontend code to GitHub.
2. Import project on [vercel.com](https://vercel.com).
3. Set environment variable:
   - `VITE_API_URL`: `https://your-backend.onrender.com/api` (The Render URL)
4. Deploy — Vercel automatically detects the Vite configuration.

### Database → MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a Database User and save the credentials.
3. Under Network Access, whitelist `0.0.0.0/0` (Allow access from anywhere) to ensure Render can connect.
4. Copy the connection string to your `MONGO_URI` variable.

---

## 💻 Run Locally

### 1. Clone & Install
```bash
git clone <repo-url>
cd datastraw
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create .env and set PORT=5000 and MONGO_URI
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Create .env and set VITE_API_URL=http://localhost:5000/api
npm run dev
```
