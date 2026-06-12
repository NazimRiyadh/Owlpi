# Owlpi — API Monitoring & Security Platform

<div align="center">

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![Live Demo](https://img.shields.io/badge/Demo-Live-success.svg)](https://owlpi.vercel.app)

**Track. Secure. Manage.** Your APIs in one intelligent, professional dashboard.

[Live Demo](https://owlpi.vercel.app) • [Deployment Guide](./DEPLOY.md) • [Report Bug](https://github.com/NazimRiyadh/Owlpi/issues) • [Request Feature](https://github.com/NazimRiyadh/Owlpi/issues)

</div>

---

## 📌 Overview

**Owlpi** is a production-ready **API Monitoring & Security Platform** designed for teams that need real-time visibility into API traffic, comprehensive analytics, and secure access control—all in a sleek, intuitive interface.

Whether you're managing microservices, protecting against suspicious activity, or building compliance-grade monitoring, Owlpi provides the tools you need to stay in control.

### Key Highlights
- 🚀 **Real-Time API Traffic Monitoring** — Capture, analyze, and visualize every API hit
- 🔐 **Enterprise Security** — Role-based access control (RBAC), API key management, IP whitelisting
- 📊 **Advanced Analytics** — Latency trends, error rates, endpoint performance, and custom metrics
- 🎯 **Team Collaboration** — Organization & team management with fine-grained permissions
- ⚡ **High-Performance Architecture** — PostgreSQL, MongoDB, RabbitMQ for scalability
- 🎨 **Beautiful UI** — Modern dashboard built with React, Tailwind CSS, and Framer Motion
- 🔄 **Smart Demo Mode** — High-fidelity fallback dashboard for portfolio & recruiter demos

---

## 🌟 Features

### 🔍 API Monitoring
- **Live Hit Tracking** — Monitor API requests in real-time with full request/response context
- **Latency & Performance** — Track response times, identify bottlenecks, and optimize endpoints
- **Error Tracking** — Capture errors, exceptions, and failed requests with stack traces
- **Traffic Patterns** — Visualize request patterns, identify spikes, and detect anomalies
- **Request Metadata** — Log HTTP method, endpoint, status code, user agent, IP address

### 🔒 Security & Access Control
- **Multi-Role RBAC** — Super Admin, Org Admin, Team Lead, Guest, and Custom roles
- **API Key Management** — Generate, rotate, and revoke API keys with per-key permissions
- **IP Whitelisting** — Restrict API access to trusted IPs and CIDR ranges
- **Origin Control** — Whitelist allowed domains for cross-origin requests
- **Audit Logging** — Track all user actions, key generations, and permission changes
- **JWT Authentication** — Secure token-based authentication with configurable expiry

### 📈 Analytics & Insights
- **Real-Time Dashboard** — Aggregate metrics, error rates, and system health at a glance
- **Latency Analysis** — P50, P95, P99 percentiles; min, max, and average response times
- **Error Rate Monitoring** — Track 4xx, 5xx errors by endpoint and identify failure patterns
- **Request Volume** — Monitor unique clients, total hits, and traffic distribution
- **Time-Series Data** — Historical trends with customizable date ranges
- **Export Capabilities** — Download reports and data for compliance or further analysis

### 👥 Team & Organization Management
- **Organizations** — Create isolated workspaces for different teams or clients
- **Team Structure** — Organize users into teams with inherited permissions
- **Granular Permissions** — Control who can ingest data, read analytics, or manage keys
- **Service Filtering** — Restrict analytics access by service name or custom tags
- **Audit Trail** — Full visibility into who did what, when, and why

### 🏗️ Architecture & Reliability
- **Async Message Queue** — RabbitMQ-powered event processing for scalable hit ingestion
- **Dual Databases** — MongoDB for event storage; PostgreSQL for analytics & users
- **TTL & Cleanup** — Automatic data archival after 30 days (configurable)
- **Circuit Breaker** — Graceful degradation when backend services fail
- **Rate Limiting** — Configurable request throttling to prevent abuse
- **Health Checks** — Liveness and readiness probes for orchestration
- **Structured Logging** — Winston-based logging with request tracing

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ with npm
- **Docker** & **Docker Compose** (optional but recommended)
- **PostgreSQL** 12+ (or via Docker)
- **MongoDB** 5+ (or via Docker)
- **RabbitMQ** 3.8+ (or via Docker)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/NazimRiyadh/Owlpi.git
   cd Owlpi
   ```

2. **Install dependencies**
   ```bash
   npm install                      # Root
   npm install --prefix server      # Backend
   npm install --prefix client      # Frontend
   ```

3. **Configure environment variables**
   
   Create `.env` in the `server` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/owlpi
   PG_HOST=localhost
   PG_PORT=5432
   PG_DATABASE=owlpi_db
   PG_USER=postgres
   PG_PASSWORD=postgres
   RABBITMQ_URL=amqp://localhost:5672
   JWT_SECRET=your-super-secret-key-change-in-production
   CORS_ORIGIN=http://localhost:5173
   ```

   Create `.env.local` in the `client` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. **Start services**
   
   **Option A: Using Docker Compose (Recommended)**
   ```bash
   docker-compose up -d
   ```

   **Option B: Manually**
   ```bash
   # Terminal 1: Backend
   npm run dev --prefix server

   # Terminal 2: Frontend
   npm run dev --prefix client
   ```

5. **Access the application**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - API: [http://localhost:5000](http://localhost:5000)
   - Health check: [http://localhost:5000/health](http://localhost:5000/health)

6. **Generate test traffic** (optional)
   ```bash
   node generate_traffic.js
   ```

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` — Create a new account
- `POST /api/auth/login` — Authenticate and receive JWT token
- `POST /api/auth/refresh` — Refresh access token
- `POST /api/auth/logout` — Logout and invalidate token

### API Hit Ingestion
- `POST /api/hit` — Submit API hit for monitoring (requires valid API key)
  ```bash
  curl -X POST http://localhost:5000/api/hit \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "serviceName": "payment-api",
      "endpoint": "/api/v1/charges",
      "method": "POST",
      "statusCode": 200,
      "latencyMs": 45,
      "userAgent": "curl/7.68.0",
      "ip": "192.168.1.1"
    }'
  ```

### Analytics
- `GET /api/analytics/metrics` — Fetch aggregated metrics (latest 24h)
- `GET /api/analytics/latency` — Get latency percentiles and trends
- `GET /api/analytics/errors` — Retrieve error rate and breakdown
- `GET /api/analytics/hits?limit=100&skip=0` — Browse recent API hits
- `GET /api/analytics/archive` — Access archived data

### Management
- `GET /api/keys` — List API keys
- `POST /api/keys` — Create new API key
- `DELETE /api/keys/:id` — Revoke API key
- `GET /api/clients` — Manage clients/services
- `GET /api/users` — User management (admin only)
- `POST /api/organizations` — Create organization
- `POST /api/teams` — Create team within organization

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ├─ Landing Page (Auth, Demo Mode)                          │
│  ├─ Dashboard (Metrics, Analytics, Management)              │
│  └─ Components (Charts, Tables, Forms)                      │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API
┌─────────────────────────▼────────────────────────────────────┐
│                    Backend (Express)                          │
│  ├─ Auth Service (JWT, RBAC, User Management)               │
│  ├─ Ingest Service (API Hit Validation & Queueing)          │
│  ├─ Analytics Service (Metrics, Aggregation, Reporting)     │
│  ├─ Processor Service (Event Consumption, Data Persistence) │
│  └─ Shared (Middleware, Config, Models, Utilities)          │
└──────┬──────────────────────────────────────────────────┬────┘
       │                                                  │
   Events (RabbitMQ)                                 Databases
       │                                                  │
       ▼                                                  ▼
   ┌────────────┐                              ┌──────────────────┐
   │ RabbitMQ   │                              │  PostgreSQL      │
   │ (Queue)    │                              │  - Users         │
   └────────────┘                              │  - API Keys      │
                                               │  - Organizations │
                                               │  - Audit Log     │
                                               └──────────────────┘
                                               │  MongoDB         │
                                               │  - API Hits      │
                                               │  - Metrics       │
                                               │  - Archives      │
                                               └──────────────────┘
```

### Technology Stack
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion, Recharts | Modern UI & visualization |
| **Backend** | Node.js, Express 5, TypeScript (DevDeps) | API & business logic |
| **Databases** | PostgreSQL, MongoDB | Relational & document data |
| **Message Queue** | RabbitMQ, amqplib | Async event processing |
| **Auth** | JWT, bcryptjs | Secure authentication |
| **Security** | Helmet, CORS, Rate Limiting | XSS, CSRF, DDoS protection |
| **Logging** | Winston | Structured logging |
| **Validation** | Zod | Input validation |
| **Dev Tools** | Nodemon, Concurrently | Development workflow |

---

## 🔐 Security Considerations

- **JWT Tokens**: Stored securely with configurable expiry (default: 7 days)
- **Password Hashing**: bcryptjs with salt rounds for secure password storage
- **API Keys**: Hashed before storage, never logged or exposed in responses
- **Rate Limiting**: Configurable per-endpoint throttling to prevent abuse
- **CORS**: Whitelist trusted origins to prevent cross-origin attacks
- **Helmet**: Comprehensive HTTP security headers
- **Input Validation**: Zod schema validation on all endpoints
- **Audit Logging**: All sensitive operations logged with user & timestamp
- **Role-Based Access**: Fine-grained RBAC for multi-tenant security

**Production Checklist:**
- [ ] Set strong `JWT_SECRET` (min 32 chars)
- [ ] Use `NODE_ENV=production`
- [ ] Enable HTTPS only
- [ ] Configure strong database passwords
- [ ] Enable database backups
- [ ] Set up monitoring and alerting
- [ ] Review and configure rate limiting
- [ ] Rotate API keys regularly
- [ ] Enable audit logging

---

## 📦 Project Structure

```
Owlpi/
├── server/
│   ├── src/
│   │   ├── services/
│   │   │   ├── auth/          # Authentication & user management
│   │   │   ├── ingest/        # API hit ingestion
│   │   │   ├── analytics/     # Analytics & metrics
│   │   │   ├── processor/     # Event processing
│   │   │   └── client/        # Client management
│   │   ├── shared/
│   │   │   ├── config/        # Database & app configuration
│   │   │   ├── models/        # Mongoose & DB schemas
│   │   │   ├── middlewares/   # Auth, validation, error handling
│   │   │   ├── utils/         # Helpers (response format, validators)
│   │   │   └── events/        # Event producer & consumer
│   │   └── server.js          # Express app entry point
│   ├── package.json
│   └── .env                   # Environment variables
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Landing/       # Landing page & auth
│   │   │   ├── Dashboard/     # Dashboard & panels
│   │   │   ├── Auth/          # Login, signup, setup
│   │   │   ├── Common/        # Reusable UI components
│   │   │   └── ui/            # Shadcn UI components
│   │   ├── DashboardPage.jsx  # Dashboard container
│   │   ├── App.jsx            # Root component & routing
│   │   ├── api.js             # API client
│   │   ├── index.css          # Styles
│   │   └── main.jsx           # React entry point
│   ├── package.json
│   └── vite.config.js
├── DEPLOY.md                  # Deployment guide (Vercel + Railway)
├── generate_traffic.js        # Test data generator
├── package.json               # Root workspace
└── README.md                  # This file
```

---

## 🚢 Deployment

### Vercel (Frontend)
1. Push code to GitHub
2. Connect repo to Vercel
3. Set root directory to `client/`
4. Configure environment variable: `VITE_API_BASE_URL`
5. Deploy

### Railway (Backend + Databases)
1. Create Railway project
2. Add services: PostgreSQL, MongoDB, RabbitMQ, and Node.js backend
3. Configure environment variables (see `DEPLOY.md`)
4. Railway auto-deploys on git push

**For detailed deployment instructions, see [DEPLOY.md](./DEPLOY.md)**

---

## 🧪 Testing & Demo

### Live Demo Mode
Visit [https://owlpi.vercel.app](https://owlpi.vercel.app) and click **"Live Demo"** to access a fully functional dashboard with mock data—no backend required!

### Local Traffic Generation
```bash
node generate_traffic.js
```
This generates realistic API hits every 1.5 seconds for testing analytics.

### Demo Credentials
- **Super Admin**: username: `admin` / password: `admin123` (register first or set via env)
- **Guest Mode**: Click "Live Demo" for instant access

---

## 📊 Key Metrics Tracked

- **Total Hits** — Cumulative API requests
- **Unique Clients** — Number of distinct API key users
- **Average Latency** — Mean response time (ms)
- **Error Rate** — Percentage of failed requests
- **Latency Percentiles** — P50, P95, P99 response times
- **Status Code Distribution** — Breakdown of 2xx, 4xx, 5xx responses
- **Endpoint Performance** — Top endpoints by traffic and latency
- **Service Health** — Overall system uptime and reliability

---

## 🤝 Contributing

We welcome contributions! Here's how to help:

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Owlpi.git
   cd Owlpi
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** and test thoroughly
   ```bash
   npm run dev
   ```

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new feature"
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style
- Use ESLint for JavaScript consistency
- Follow existing code patterns
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes locally

---

## 📝 License

This project is licensed under the **ISC License** — see [LICENSE](./LICENSE) file for details.

---

## 🆘 Troubleshooting

### **Backend won't start**
```bash
# Check database connections
curl http://localhost:5000/health

# Verify environment variables
env | grep -E "MONGO|PG|RABBITMQ|JWT"

# Check port availability
lsof -i :5000
```

### **Frontend API calls failing**
```bash
# Verify backend is running
curl http://localhost:5000

# Check CORS origin configuration
# Should match VITE_API_BASE_URL

# Clear browser cache
# localStorage.clear()
```

### **RabbitMQ connection error**
```bash
# Ensure RabbitMQ is running
docker ps | grep rabbitmq

# Check queue status
# docker exec <container> rabbitmqctl list_queues
```

### **Database migration issues**
```bash
# Reset databases (dev only!)
npm run dev --prefix server  # Auto-initializes on startup

# Manual PostgreSQL reset
# psql -U postgres -c "DROP DATABASE owlpi_db;" 
# psql -U postgres -c "CREATE DATABASE owlpi_db;"
```

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/NazimRiyadh/Owlpi/issues)
- **Discussions**: [GitHub Discussions](https://github.com/NazimRiyadh/Owlpi/discussions)
- **Live Demo**: [https://owlpi.vercel.app](https://owlpi.vercel.app)

---

## 🙏 Acknowledgments

Built with ❤️ for teams that need visibility into their APIs.

Powered by:
- [Express.js](https://expressjs.com/) — Web framework
- [React](https://react.dev/) — UI library
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [Recharts](https://recharts.org/) — Data visualization
- [MongoDB](https://www.mongodb.com/) & [PostgreSQL](https://www.postgresql.org/) — Databases
- [RabbitMQ](https://www.rabbitmq.com/) — Message broker

---

<div align="center">

**[Live Demo](https://owlpi.vercel.app)** • **[Deployment Guide](./DEPLOY.md)** • **[Report Issue](https://github.com/NazimRiyadh/Owlpi/issues)**

*Made with ✨ for API monitoring & security*

</div>
