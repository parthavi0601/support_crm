# SupportDesk CRM

A production-ready Customer Support Ticketing CRM System built with React (Vite), Node.js, Express, and MongoDB Atlas — featuring an **AI Assistant** powered by OpenAI and **automatic ticket creation from Gmail**.

🔗 **Live Demo:** [Frontend on Vercel](https://your-frontend.vercel.app) · [Backend on Render](https://your-backend.onrender.com)

---

## Features

### Core
- **Ticket Management** — Create, view, update, and search support tickets with full pagination
- **Priority Management** — Low / Medium / High / Critical tagging with priority-based sorting
- **Status Workflow** — Open → In Progress → Closed with close confirmation guard
- **Ticket Assignment** — Delegate tickets to specific support agents
- **Notes & Communication Timeline** — Internal notes logged with timestamps in a vertical timeline
- **Activity History** — Every lifecycle event (creation, status/priority change, reassignment, notes) auto-logged

### AI Assistant (OpenAI GPT-4o-mini)
Surfaced inside each Ticket Detail page:
- **Auto-Summary** — Generates a 2-3 sentence plain-English summary of the issue
- **Priority Suggestion** — AI recommends a priority level with reasoning; one-click "Apply" to set it
- **Category Detection** — Classifies tickets (Billing, Technical Issue, Bug Report, etc.) with confidence level
- **Response Drafting** — Writes a professional customer reply; one-click copy to clipboard

### Gmail Email Integration
- Polls a configured Gmail inbox every 5 minutes for unread emails
- Auto-creates a ticket from each new email (parses sender name, email, subject, body)
- Marks processed emails as read
- Only processes emails received **after** server startup (ignores old inbox)

### UI/UX
- Dark mode (true black `#0a0a0a`) and light mode with a toggle
- Responsive layout with a persistent sidebar
- MUI v6 component library with a custom design system

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| UI Library | Material UI (MUI v6) |
| Routing | React Router DOM |
| Networking | Axios |
| Notifications | react-hot-toast |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas (Mongoose) |
| AI | OpenAI API (`gpt-4o-mini`) |
| Email | Gmail API (OAuth2 via `googleapis`) |

---

## Database Schema

### `Ticket`
| Field | Type | Notes |
|-------|------|-------|
| `ticketId` | String | Auto-generated (TKT-001, TKT-002…) |
| `customerName` | String | Required |
| `customerEmail` | String | Required, validated |
| `subject` | String | Required |
| `description` | String | Required |
| `status` | Enum | Open / In Progress / Closed |
| `priority` | Enum | Low / Medium / High / Critical |
| `assignedTo` | String | Default: Unassigned |
| `createdAt` / `updatedAt` | Timestamps | Auto |

### `Note`
`ticketId`, `noteText`, `createdAt`

### `Activity`
`ticketId`, `actionType` (TICKET_CREATED / STATUS_CHANGED / PRIORITY_CHANGED / NOTE_ADDED / ASSIGNMENT_CHANGED), `description`, `createdAt`

---

## API Reference

### Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/tickets` | Create a ticket |
| `GET` | `/api/tickets` | List tickets (search, filter, paginate) |
| `GET` | `/api/tickets/:ticketId` | Get ticket + notes + activities |
| `PUT` | `/api/tickets/:ticketId` | Update status / priority / assignee / add note |
| `GET` | `/api/tickets/activity` | Recent activity feed |

**Query params for GET /api/tickets:**
`?search=&status=Open&priority=Critical&assignedTo=John&sort=priority&page=1&limit=10`

### AI Assistant
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/analyze` | Run all 4 AI analyses on a ticket |

**Body:** `{ subject, description, notes[] }`  
**Response:** `{ summary, priority: { priority, reason }, response, category: { category, confidence } }`

---

## Deployment

### Prerequisites — Environment Variables

**Backend (Render):**
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/crm
OPENAI_API_KEY=sk-...
GMAIL_CREDENTIALS={"installed":{"client_id":"...","client_secret":"...",...}}
GMAIL_REFRESH_TOKEN=1//...
```

**Frontend (Vercel):**
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### Backend → Render
1. Push to GitHub
2. New **Web Service** on [render.com](https://render.com)
3. **Root Directory:** `backend`
4. **Build Command:** `npm install`
5. **Start Command:** `node server.js`
6. Add all backend environment variables above

### Frontend → Vercel
1. Import repo on [vercel.com](https://vercel.com)
2. **Root Directory:** `frontend`
3. **Framework Preset:** Vite (auto-detected)
4. Add `VITE_API_URL` environment variable
5. Deploy

### Database → MongoDB Atlas
1. Create free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Network Access → Whitelist `0.0.0.0/0`
3. Copy connection string → `MONGO_URI`

---

## Gmail Integration Setup (One-Time)

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → **Enable Gmail API**
2. Create **OAuth 2.0 Credentials** → Application type: **Desktop app** → Download JSON
3. Paste the JSON (minified, single line) as `GMAIL_CREDENTIALS` in your `.env`
4. Add `vidyag2504@gmail.com` as a **Test User** on the OAuth consent screen
5. Run the token generator:
   ```bash
   cd backend
   node scripts/get-gmail-token.js
   ```
6. Authorize in the browser → copy the auth code → paste in terminal
7. Copy the printed `GMAIL_REFRESH_TOKEN` into `.env` and Render environment variables
8. Restart server — email polling starts automatically

---

## Run Locally

### 1. Clone & Install
```bash
git clone <repo-url>
cd datastraw
```

### 2. Backend
```bash
cd backend
npm install
# Copy .env.example to .env and fill in values
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
# Copy .env.example to .env → set VITE_API_URL=http://localhost:5000/api
npm run dev
# App runs on http://localhost:5173
```
