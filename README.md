# Advanced Web Development Frameworks (ITUE301) — Laboratory Practicals

**Student:** Vivek Sangani  
**Enrollment No:** 24CE108  
**Institution:** Charotar University of Science and Technology (CHARUSAT)  
**Faculty:** Faculty of Technology and Engineering (CSPIT-IT)  
**Subject:** Advanced Web Development Frameworks (`ITUE301`)  
**Semester:** 5 | **Academic Year:** 2026–27  

---

## 1. Project Overview & Architecture

This repository contains the full-stack, enterprise-grade web application integrating all 13 laboratory practicals for the **Advanced Web Development Frameworks** course.

The project is structured as a full-stack monorepo:
- **Frontend (Root):** React 19 + Vite 6 + React Router 7 responsive student portfolio with route-based lazy loading, GitHub API integration, and an interactive Task Management interface with AI assistance.
- **Backend (`Practical - 4 To 13/`):** Node.js + Express REST API with MongoDB Mongoose persistence, bcrypt password hashing, JWT authentication (1h expiry), in-memory caching (`node-cache` 60s TTL), event-driven notifications (`node:events`), and secure AI proxy routing.
- **Containerization & CI/CD:** Multi-service `docker-compose.yml` and automated GitHub Actions test pipeline (`.github/workflows/ci.yml`).

---

## 2. Practical Implementation Mapping

| Practical | Title / Focus | File Location in Project | Description |
|:---:|:---|:---|:---|
| **01** | React Components & Architecture | `src/components/` (`Header`, `About`, `Skills`, `Projects`, `Footer`) | Functional components, props passing, dynamic `.map()` rendering. |
| **02** | State Management & Routing | `src/App.jsx`, `src/pages/Contact.jsx` | `BrowserRouter`, `Routes`, `Route`, `NavLink`, dark/light theme toggle, controlled contact form with live char count. |
| **03** | Public REST API Integration | `src/components/Projects.jsx` | Fetches live repositories from `https://api.github.com/users/vsangani2337/repos`, loading skeleton, retry action, search filter. |
| **04** | Node.js + Express REST API | `Practical - 4 To 13/practical-4/server.js` | Full CRUD REST API with request logging and error handling using in-memory store. |
| **05** | Database Integration with MongoDB | `Practical - 4 To 13/practical - 5 To 13/models/Task.js` | Mongoose schema design, data validation constraints, MongoDB persistence. |
| **06** | Full-Stack Integration | `src/api.js`, `src/pages/TaskManager.jsx` | React UI communicating with backend via CORS; task creation, toggling, and deletion. |
| **07** | Authentication & Middleware | `practical - 5 To 13/middleware/auth.js`, `validateTask.js`, `models/User.js` | User registration/login, bcrypt password hashing, JWT generation (1h expiry), `requireAuth` Bearer middleware, `/me` endpoint. |
| **08** | Performance & Lazy Loading | `src/App.jsx`, `src/components/LoadingFallback.jsx` | Route-based code splitting using `React.lazy()` and `<Suspense>`, reducing initial bundle payload. |
| **09** | In-Memory Caching | `practical - 5 To 13/cache.js`, `routes/taskRoutes.js` | `node-cache` (TTL 60s) on `GET /tasks`, automatic cache invalidation on write (`POST`, `PUT`, `DELETE`), ~21x speedup. |
| **10** | Event-Driven Architecture | `practical - 5 To 13/events.js`, `listeners.js`, `demo_events.mjs` | Built-in `EventEmitter`, non-blocking HTTP 201 response, asynchronous 1500ms background notification worker. |
| **11** | Docker Containerization | `Dockerfile`, `Practical - 4 To 13/docker-compose.yml` | Multi-stage Docker build for frontend, Node backend container, MongoDB 7 with volume persistence and healthcheck. |
| **12** | CI/CD Pipeline & Testing | `.github/workflows/ci.yml`, `practical - 5 To 13/server.test.js` | Automated GitHub Actions CI workflow, Jest + Supertest test suite asserting 401 unauthenticated response. |
| **13** | AI API Integration | `practical - 5 To 13/routes/aiRoutes.js`, `src/pages/TaskManager.jsx` | Protected backend `/api/ai/generate-description` route, "Generate with AI" button, editable suggestion, char count, local fallback. |

---

## 3. How to Run Locally

### Prerequisites
- Node.js v20.x or v24.x
- npm v10.x or v12.x
- MongoDB running on `mongodb://127.0.0.1:27017`

### Step 1: Run the Backend
```bash
cd "Practical - 4 To 13"
npm install
npm start
```
*Backend API starts on `http://localhost:5000`.*

### Step 2: Run the Frontend
In a new terminal:
```bash
# In the root project directory:
npm install
npm run dev
```
*Vite development server starts at `http://localhost:5173`.*

### Step 3: Run Automated Tests
```bash
cd "Practical - 4 To 13"
npm test
```

### Step 4: Run with Docker Compose
```bash
cd "Practical - 4 To 13"
docker compose up --build
```

---

## 4. Personalization Details

All student portfolio data is customizable in:
[`src/data/studentConfig.js`](file:///c:/D%20Drive/Programming/AWF/Advanced_Web_Development_Practicals_24CE108/src/data/studentConfig.js)

```javascript
export const studentConfig = {
  name: "Vivek Sangani",
  initials: "VS",
  enrollmentNo: "24CE108",
  university: "Charotar University of Science and Technology",
  faculty: "CSPIT-IT",
  email: "vsangani2337@gmail.com",
  phone: "+91 9924097202",
  githubUrl: "https://github.com/vsangani2337",
  githubUsername: "vsangani2337",
  linkedinUrl: "https://linkedin.com/in/viveksangani",
};
```
# Advanced_Web_Development_Practicals_24CE108
