# Career Gateway — Full Project Explanation

## What Is This Project?

**Career Gateway** is a full-stack web application that helps students figure out the right career path for them. A student signs up, takes a few assessments (personality test, skills evaluation, interest profiler), and the app gives them **personalized career recommendations** based on their answers.

Think of it like a **career counselor, but online**.

---

## Why Is This Project Useful?

- Many students don't know what career suits them after college
- Going to a real career counselor costs money and time
- This app gives **instant, free career guidance** based on scientific assessments
- It saves assessment history so students can revisit and compare their results over time
- Admins can see how many users are registered and how many assessments have been taken

---

## Tech Stack (What Technologies Are Used)

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | React + Vite | Fast, modern UI framework for building interactive pages |
| **Backend** | Spring Boot (Java) | Powerful server framework to handle API requests and business logic |
| **Database** | MySQL | Reliable relational database to store users and assessment results |
| **Authentication** | JWT (JSON Web Tokens) | Secure, stateless login — no server-side sessions needed |
| **Password Security** | BCrypt | Hashes passwords so they are never stored as plain text |
| **Styling** | Vanilla CSS | Custom-designed, no CSS framework dependency |

---

## Project Folder Structure

```
career-path-pro-final-project-main/
├── career-gateway-frontend/    ← React app (what the user sees)
│   └── src/
│       ├── components/         ← Reusable UI pieces (Navbar, Footer, CareerCard)
│       ├── pages/              ← Full pages (Home, SignIn, Assessments, Results, etc.)
│       ├── context/            ← AuthContext (manages who is logged in)
│       ├── utils/              ← Helper files (API caller, analytics, recommendations)
│       └── App.jsx             ← Main file that sets up all the routes
│
├── career-gateway-backend/     ← Spring Boot app (handles data & logic)
│   └── src/main/java/.../
│       ├── controller/         ← API endpoints (AuthController, UserController, etc.)
│       ├── entity/             ← Database table definitions (User, AssessmentResult)
│       ├── repository/         ← Database query interfaces
│       ├── dto/                ← Request/response data shapes
│       ├── config/             ← CORS config (allows frontend to talk to backend)
│       └── util/               ← JWT token generator/validator
```

---

## Frontend — React Routing (All the Pages)

The app uses **React Router** to navigate between pages without reloading the browser. Here are all the routes:

| Route | Page | Who Can Access | What It Does |
|---|---|---|---|
| `/` | Home | Everyone | Landing page — explains the app, call-to-action buttons |
| `/signin` | Sign In | Everyone | Login form for existing users |
| `/signup` | Sign Up | Everyone | Registration form for new users |
| `/resources` | Resources | Everyone | Career articles, learning links, study materials |
| `/assessments` | Assessments | Logged-in users only | Dashboard showing the 3 available assessments |
| `/personality-test` | Personality Test | Logged-in users only | Quiz about your personality traits |
| `/skills-evaluation` | Skills Evaluation | Logged-in users only | Quiz about your technical/soft skills |
| `/interest-profiler` | Interest Profiler | Logged-in users only | Quiz about your interests and hobbies |
| `/results` | Results | Logged-in users only | Shows career recommendations based on your answers |
| `/settings` | Settings | Logged-in users only | Update profile, delete account |
| `/career-explorer` | Career Explorer | Logged-in users only | Browse and explore different career options |
| `/admin` | Admin Panel | Admin only | View all users, platform stats |

### How Route Protection Works

```
PrivateRoute → Checks: Is the user logged in?
   ├── YES → Show the page
   └── NO  → Redirect to /signin

AdminRoute → Checks: Is the user logged in AND role === "admin"?
   ├── YES → Show admin panel
   └── NO  → Redirect to home page
```

---

## Backend — API Endpoints (What the Server Does)

The backend runs on **port 8080** and all endpoints start with `/api/`. Here is what each controller handles:

### AuthController (`/api/auth`)

| Method | Endpoint | What It Does |
|---|---|---|
| POST | `/api/auth/signup` | Creates a new user account. Hashes the password with BCrypt. Returns a JWT token. |
| POST | `/api/auth/signin` | Checks email + password. If correct, returns user data + JWT token. |

### AssessmentController (`/api/assessments`)

| Method | Endpoint | What It Does |
|---|---|---|
| POST | `/api/assessments/save` | Saves a user's assessment answers (personality/skills/interest) to the database |
| GET | `/api/assessments/history/{userId}` | Gets all past assessment results for a specific user |

### UserController (`/api/users`)

| Method | Endpoint | What It Does |
|---|---|---|
| PUT | `/api/users/{userId}` | Updates user profile (name, etc.) — requires JWT token |
| DELETE | `/api/users/{userId}` | Permanently deletes user account and all their assessment data — requires JWT token |

### AdminController (`/api/admin`)

| Method | Endpoint | What It Does |
|---|---|---|
| GET | `/api/admin/users` | Returns list of all registered users (passwords removed) |
| GET | `/api/admin/stats` | Returns total user count and total assessment count |

---

## How Frontend and Backend Are Connected

Here is the step-by-step flow:

```
  React Frontend (port 5173)          Spring Boot Backend (port 8080)
  ─────────────────────────            ──────────────────────────────
          │                                        │
          │   1. User clicks "Sign Up"             │
          │──── POST /api/auth/signup ────────────>│
          │     { name, email, password }          │
          │                                        │ 2. Backend hashes password
          │                                        │    saves to MySQL database
          │                                        │    generates JWT token
          │<── { user data + JWT token } ─────────│
          │                                        │
          │   3. Frontend stores token in          │
          │      localStorage                      │
          │                                        │
          │   4. User takes a personality test     │
          │──── POST /api/assessments/save ───────>│
          │     { userId, type, answers }          │
          │     + Authorization: Bearer <token>    │
          │                                        │ 5. Backend saves to DB
          │<── { success: true } ─────────────────│
          │                                        │
```

### The Key Connector: `api.js`

The frontend has a helper file called `api.js` that handles **every** API call:

1. It reads the backend URL from an environment variable (`VITE_API_URL`)
2. It automatically attaches the **JWT token** from localStorage to every request
3. It converts data to JSON and sends it via `fetch()`
4. It handles errors gracefully

This means **every page that needs data** just calls `apiCall('/some-endpoint', options)` — simple and clean.

### CORS (Cross-Origin Resource Sharing)

Since the frontend (port 5173) and backend (port 8080) run on different ports, the browser would normally block requests between them. The backend has a **WebConfig.java** file that enables CORS — it tells the browser: *"Yes, it's okay for the frontend to talk to me."*

---

## Authentication Flow (Login System)

### Sign Up Flow

1. User fills out sign-up form
2. Frontend validates fields (name, email, password match, etc.) in real-time
3. Sends POST request to `/api/auth/signup`
4. Backend checks if email already exists
5. Hashes password using BCrypt
6. Saves user to MySQL (role = "student")
7. Generates JWT token (valid for 24 hours)
8. Returns user info + token to frontend
9. Frontend saves token in localStorage
10. User is now logged in → redirected to `/assessments` page

### Sign In Flow

1. User enters email + password
2. Sends POST request to `/api/auth/signin`
3. Backend finds user by email in database
4. Compares password using BCrypt
5. If match → generates JWT → returns user + token
6. Frontend saves to localStorage
7. AuthContext updates → app re-renders
8. Navbar shows user name + logout button
9. Protected routes become accessible

### What is the JWT Token?

- JWT = JSON Web Token
- It's a long encoded string that contains: **user's email, role, userId, and expiry time**
- The frontend sends it with every API request in the `Authorization` header
- The backend checks if the token is valid before allowing actions like updating/deleting a profile
- It expires after **24 hours**, then the user must log in again

---

## Database Design (MySQL)

There are **2 tables** in the database:

### `users` table

| Column | Type | Description |
|---|---|---|
| id | BIGINT (auto) | Unique ID for each user |
| name | VARCHAR | User's full name |
| email | VARCHAR (unique) | User's email — used for login |
| password | VARCHAR | BCrypt-hashed password |
| role | VARCHAR | "student" or "admin" |
| created_at | DATETIME | When the account was created |

### `assessment_results` table

| Column | Type | Description |
|---|---|---|
| id | BIGINT (auto) | Unique ID for each result |
| user_id | BIGINT | Links to the `users` table |
| assessment_type | VARCHAR | "personality", "skills", or "interest" |
| answers_json | TEXT | All answers stored as a JSON string |
| completed_at | DATETIME | When the assessment was completed |

---

## Complete User Journey

```
Home Page
   │
   ├──> New User clicks "Get Started"
   │       │
   │       v
   │    Sign Up Page
   │       │  (fills name, email, education, password)
   │       │  (real-time validation shows errors instantly)
   │       v
   │    Account Created → JWT token saved
   │       │
   │       v
   │    Assessments Dashboard
   │       │  (shows 3 assessment cards)
   │       │
   │       ├──> Personality Test (answer quiz questions)
   │       ├──> Skills Evaluation (rate your skills)
   │       └──> Interest Profiler (pick your interests)
   │               │
   │               v
   │            Results Page
   │               (shows career recommendations based on answers)
   │               (shows assessment history)
   │
   ├──> Returning User clicks "Sign In"
   │       │
   │       v
   │    Sign In Page → JWT token saved → redirected in
   │
   ├──> Career Explorer (browse career options)
   │
   ├──> Resources (articles, courses, learning materials)
   │
   ├──> Settings (update name, delete account)
   │
   └──> Admin Panel (admin only — view all users, stats)
```

---

## Summary

| Aspect | Details |
|---|---|
| **What** | Career guidance web app with assessments and recommendations |
| **Frontend** | React + Vite with React Router for navigation |
| **Backend** | Spring Boot with REST APIs |
| **Database** | MySQL with 2 tables (users, assessment_results) |
| **Security** | BCrypt password hashing + JWT token authentication |
| **Connection** | Frontend calls backend APIs using `fetch()` via `api.js` helper, CORS enabled on backend |
| **Deployment** | Frontend on Vercel/Netlify, Backend on Render |
| **Who it helps** | Students confused about which career to choose |
