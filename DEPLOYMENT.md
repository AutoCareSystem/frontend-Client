# Deployment Guide

This guide covers Docker setup and Vercel deployment for the frontend_EAD project.

## 🐳 Docker Deployment

### Prerequisites
- Docker installed on your system
- Docker Compose (optional, but recommended)

### Building and Running with Docker

#### Option 1: Using Docker directly

1. **Build the Docker image:**
   ```bash
   docker build -t frontend-ead .
   ```

2. **Run the container:**
   ```bash
   docker run -d -p 3000:80 --name frontend-ead frontend-ead
   ```

3. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`

#### Option 2: Using Docker Compose

1. **Build and start the container:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Stop the container:**
   ```bash
   docker-compose down
   ```

### Docker Commands Reference

- **Build image:** `docker build -t frontend-ead .`
- **Run container:** `docker run -d -p 3000:80 frontend-ead`
- **View running containers:** `docker ps`
- **Stop container:** `docker stop frontend-ead`
- **Remove container:** `docker rm frontend-ead`
- **View logs:** `docker logs frontend-ead`
- **Remove image:** `docker rmi frontend-ead`

---

## 🚀 Vercel Deployment

### Prerequisites
- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Git repository (GitHub, GitLab, or Bitbucket)
- Your project pushed to the repository

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin frontendIntegration
   ```

2. **Import your project:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your repository (frontend_EAD)
   - Vercel will auto-detect it's a Vite project

3. **Configure project settings:**
   - **Framework Preset:** Vite (auto-detected)
   - **Root Directory:** `frontend_EAD` (if your repo root contains this folder)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)
   - **Production Branch:** `frontendIntegration` (IMPORTANT: Change from main/master)

4. **Add Environment Variables (if needed):**
   - Click "Environment Variables"
   - Add any required variables (e.g., API endpoints, keys)

5. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Deploying frontendIntegration Branch (Specific Branch)

#### Option A: Set as Production Branch (Recommended)

1. **After initial deployment, configure the production branch:**
   - Go to your project dashboard on Vercel
   - Navigate to **Settings** → **Git**
   - Under **Production Branch**, change from `main`/`master` to `frontendIntegration`
   - Save changes
   - Vercel will automatically redeploy from the `frontendIntegration` branch

2. **Push to your branch:**
   ```bash
   git checkout frontendIntegration
   git add .
   git commit -m "Update for deployment"
   git push origin frontendIntegration
   ```

#### Option B: Deploy Branch Manually via Dashboard

1. **Push your branch:**
   ```bash
   git checkout frontendIntegration
   git push origin frontendIntegration
   ```

2. **Deploy from Vercel Dashboard:**
   - Go to your project dashboard on Vercel
   - Click on **Deployments** tab
   - Click **"Create Deployment"** button
   - Select branch: `frontendIntegration`
   - Click **"Deploy"**

#### Option C: Deploy Branch via CLI

1. **Checkout and push your branch:**
   ```bash
   git checkout frontendIntegration
   git push origin frontendIntegration
   ```

2. **Deploy specific branch with Vercel CLI:**
   ```bash
   cd frontend_EAD
   vercel --prod --branch frontendIntegration
   ```

   Or if you want to deploy as a preview:
   ```bash
   vercel --branch frontendIntegration
   ```

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Navigate to your project directory:**
   ```bash
   cd frontend_EAD
   ```

4. **Make sure you're on the frontendIntegration branch:**
   ```bash
   git checkout frontendIntegration
   ```

5. **Deploy:**
   ```bash
   vercel
   ```
   - Follow the prompts:
     - Set up and deploy? **Yes**
     - Which scope? Select your account
     - Link to existing project? **No** (for first deployment)
     - Project name? Enter a name or press Enter for default
     - Directory? `./` (current directory)
     - Override settings? **No**

6. **For production deployment from frontendIntegration branch:**
   ```bash
   vercel --prod
   ```
   
   Or explicitly specify the branch:
   ```bash
   vercel --prod --branch frontendIntegration
   ```

### Vercel Configuration

The `vercel.json` file is already configured with:
- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite
- SPA routing support (all routes redirect to index.html)

### Environment Variables in Vercel

1. Go to your project dashboard on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add your variables:
   - **Name:** `VITE_API_URL` (or your variable name)
   - **Value:** Your API URL
   - **Environment:** Production, Preview, Development (select as needed)

### Custom Domain Setup

1. Go to your project dashboard on Vercel
2. Navigate to **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

### Continuous Deployment

By default, Vercel automatically deploys:
- **Production:** Every push to `main` or `master` branch (or your configured production branch)
- **Preview:** Every push to other branches or pull requests

**For frontendIntegration branch:**
- If set as production branch: Every push to `frontendIntegration` will trigger a production deployment
- If not set as production: Every push to `frontendIntegration` will create a preview deployment

### Troubleshooting

#### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify `vercel.json` configuration

#### Routing Issues
- The `vercel.json` includes SPA routing rewrites
- Ensure all routes redirect to `index.html`

#### Environment Variables Not Working
- Variables must be prefixed with `VITE_` to be accessible in Vite
- Redeploy after adding new environment variables

---

## 📝 Notes

- **Docker:** Best for local development, testing, or self-hosting
- **Vercel:** Best for production deployment with automatic CI/CD
- Both methods are production-ready and optimized

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Docker Documentation](https://docs.docker.com/)

