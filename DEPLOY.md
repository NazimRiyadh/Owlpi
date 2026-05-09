# Owlpi Deployment Guide

This guide explains how to deploy the Owlpi Infrastructure Monitoring Platform to production using Vercel (Frontend) and Railway (Backend/DB).

## 1. Prerequisites
- A GitHub account with the code pushed to a repository.
- Accounts on [Vercel](https://vercel.com) and [Railway](https://railway.app).

## 2. Infrastructure Setup (Railway.app)
1. **Create a New Project** on Railway.
2. **Add Services**:
   - **PostgreSQL**: Add from the "Database" menu.
   - **MongoDB**: Add from the "Database" menu.
   - **RabbitMQ**: Add from the "Database" menu.
3. **Add Backend Service**:
   - Select your GitHub repo -> `server` directory.
   - Railway will automatically detect the `package.json` and start the server.
4. **Environment Variables** (Railway will auto-generate most of these for the DBs):
   - `PORT`: 8080
   - `NODE_ENV`: production
   - `MONGO_URI`: (Automatically provided by Railway MongoDB)
   - `PG_URI`: (Automatically provided by Railway PostgreSQL)
   - `RABBITMQ_URL`: (Automatically provided by Railway RabbitMQ)
   - `JWT_SECRET`: (Generate a long random string)
   - `CORS_ORIGIN`: Your Vercel URL (e.g., `https://owlpi-demo.vercel.app`)

## 3. Frontend Setup (Vercel)
1. **Create a New Project** on Vercel.
2. **Connect GitHub Repo**: Select the `client` directory as the Root Directory.
3. **Build Settings**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables**:
   - `VITE_API_BASE_URL`: Your Railway Backend URL (e.g., `https://owlpi-api.up.railway.app`)

## 4. Final Verification
1. Access your Vercel URL.
2. Test the **Live Demo** button.
3. Test the **Super Admin Demo** credentials.
4. Verify that charts are populating (using the built-in mock fail-safes).

---
*Note: The project includes a "Smart Demo" bypass. Even if your backend is currently offline or the database is unseeded, recruiters will still see a beautiful, high-fidelity dashboard for a perfect portfolio impression.*
