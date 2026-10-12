# 🚀 EventOps - Cloud Deployment Guide

This guide details how to deploy the **EventOps** full-stack system (Spring Boot + React + MySQL) to the cloud.

---

## 🏗️ Architecture Overview

| Component | Technology | Recommended Host | Free Tier Available? |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 18, Vite | [Vercel](https://vercel.com) or [Netlify](https://netlify.com) | Yes (Free) |
| **Backend** | Spring Boot 3.3, Java 21 | [Render](https://render.com) or [Railway](https://railway.app) | Yes |
| **Database** | MySQL 8.0 | [Railway](https://railway.app), [Aiven](https://aiven.io), or [Render](https://render.com) | Yes |

---

## Step 1: Push Code to GitHub

Initialize git and push your project to a GitHub repository:

```powershell
cd e:\EventOps
git init
git add .
git commit -m "feat: complete EventOps fullstack application with deployment configs"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/EventOps.git
git push -u origin main
```

---

## Step 2: Deploy MySQL Database

### Using Railway (Easiest & Fastest):
1. Sign up / Log in to [railway.app](https://railway.app).
2. Click **New Project** → **Provision MySQL**.
3. Once provisioned, click the MySQL card and go to the **Variables** tab.
4. Note down:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - Or copy `MYSQL_URL`

*(Spring Boot will automatically create all tables and populate initial seed data on its first launch via Hibernate and DataInitializer).*

---

## Step 3: Deploy Backend (Spring Boot) to Render

1. Sign up / Log in to [render.com](https://render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Fill in the settings:
   - **Name:** `eventops-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Java` or `Docker`
   - **Build Command:** `./mvnw clean package -DskipTests`
   - **Start Command:** `java -jar target/eventops-backend-1.0.0.jar`
   - **Instance Type:** `Free`
5. Under **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `DB_HOST` | *(Your MySQL host from Step 2)* |
   | `DB_PORT` | `3306` (or provided port) |
   | `DB_NAME` | `eventops` (or provided database) |
   | `DB_USERNAME` | *(Your MySQL user)* |
   | `DB_PASSWORD` | *(Your MySQL password)* |
   | `JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` |
6. Click **Deploy Web Service**.
7. Once deployed, copy your backend URL (e.g., `https://eventops-backend.onrender.com`).

---

## Step 4: Deploy Frontend (React + Vite) to Vercel

1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New...** → **Project** and import your GitHub repository.
3. Configure the project:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click `Edit` and select `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Expand **Environment Variables** and add:
   | Key | Value | Example |
   | :--- | :--- | :--- |
   | `VITE_API_URL` | `<BACKEND_URL>/api` | `https://eventops-backend.onrender.com/api` |
5. Click **Deploy**.
6. Vercel will build and provide your live application URL (e.g., `https://eventops.vercel.app`).

---

## Step 5: Verify Deployment

1. Visit your live frontend URL.
2. Sign in with any of the seeded accounts:
   - **Admin:** `admin@eventops.com` / `admin123`
   - **Coordinator:** `coordinator@eventops.com` / `coord123`
   - **Team Lead:** `teamlead@eventops.com` / `lead123`
   - **Volunteer:** `volunteer@eventops.com` / `vol123`
3. All dashboard metrics, events, resources, tasks, and role-based permissions are live and backed by your cloud database!

---

## Alternative: One-Click Local / VPS Docker Stack

If you want to run the entire stack on any VPS (AWS EC2, DigitalOcean, Hetzner, etc.):

```bash
docker compose up -d --build
```
* **Frontend:** `http://<SERVER_IP>`
* **Backend:** `http://<SERVER_IP>:8080`
* **MySQL:** `localhost:3306`
