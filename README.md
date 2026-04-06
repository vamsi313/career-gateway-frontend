# Career Gateway - Full Stack Application

A comprehensive career guidance platform built with **React (Vite)** frontend and **Spring Boot** backend connected to **MySQL**.

## 📁 Project Structure

```
career-path-pro-final-project-main/
├── career-gateway-frontend/    # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # Auth context (React Context API)
│   │   ├── data/               # Static data (questions, careers)
│   │   ├── pages/              # Page components
│   │   └── utils/              # API helper, analytics, recommendations
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── career-gateway-backend/     # Spring Boot backend (separate git repo)
│   ├── src/main/java/com/example/careergateway/
│   │   ├── controller/         # REST API controllers
│   │   ├── entity/             # JPA entities (User, AssessmentResult)
│   │   ├── repository/         # Spring Data JPA repositories
│   │   ├── dto/                # Data Transfer Objects
│   │   └── config/             # CORS & web configuration
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
└── README.md
```

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, React Router 6 |
| Backend | Spring Boot 4.0.5, Spring Data JPA |
| Database | MySQL 8.0 |
| Build | Maven (backend), npm (frontend) |

## 🗄️ Database Schema

### `users` table
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT (PK) | Auto-increment |
| name | VARCHAR | User full name |
| email | VARCHAR (UNIQUE) | Login email |
| password | VARCHAR | Plain text password |
| role | VARCHAR | "student" or "admin" |
| created_at | DATETIME | Account creation time |

### `assessment_results` table
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT (PK) | Auto-increment |
| user_id | BIGINT | References users.id |
| assessment_type | VARCHAR | personality / skills / interest |
| answers_json | TEXT | JSON string of answers |
| completed_at | DATETIME | Completion timestamp |

## 🏃 Running Locally

### Prerequisites
- Java 17+ (JDK)
- Node.js 18+
- MySQL 8.0

### 1. Start MySQL
```bash
mysql -u root -p
CREATE DATABASE gateway_db;
```

### 2. Start Backend (port 8080)
```bash
cd career-gateway-backend
./mvnw spring-boot:run
```

### 3. Start Frontend (port 5173)
```bash
cd career-gateway-frontend
npm install
npm run dev
```

### 4. Open the app
Visit **http://localhost:5173**

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new student |
| POST | `/api/auth/signin` | Student login |
| POST | `/api/auth/admin-signin` | Admin login |
| POST | `/api/assessments/save` | Save assessment result |
| GET | `/api/assessments/history/{userId}` | Get user's assessment history |
| GET | `/api/admin/users` | List all users (admin) |
| GET | `/api/admin/stats` | Dashboard stats (admin) |

## 👤 Roles

- **Student**: Sign up, take assessments (Personality, Skills, Interest), view results, explore careers
- **Admin**: View all users, dashboard statistics

## 📦 Git Repositories

- **Frontend**: [career-gateway-frontend](https://github.com/vamsi313/career-gateway-frontend)
- **Backend**: [career-gateway-backend](https://github.com/vamsi313/career-gateway-backend)
