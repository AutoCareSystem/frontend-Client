# Quick Guide: Deploy frontendIntegration Branch to Vercel

## 🚀 Fastest Method (Recommended)

### Step 1: Push Your Branch

```bash
git checkout frontendIntegration
git push origin frontendIntegration
```

### Step 2: Deploy via Vercel Dashboard

1. **Go to Vercel:** [vercel.com/new](https://vercel.com/new)
2. **Import your repository**
3. **During setup, set Production Branch to:** `frontendIntegration`
4. **Click Deploy**

That's it! Your app will be live.

---

## 📋 Alternative Methods

### Method 1: Set Production Branch After Initial Deploy

If you've already deployed from main/master:

1. Go to your **Vercel Project Dashboard**
2. Navigate to **Settings** → **Git**
3. Change **Production Branch** from `main` to `frontendIntegration`
4. Save - Vercel will automatically redeploy

### Method 2: Manual Deployment from Dashboard

1. Push your branch:

   ```bash
   git push origin frontendIntegration
   ```

2. In Vercel Dashboard:
   - Go to **Deployments** tab
   - Click **"Create Deployment"**
   - Select branch: `frontendIntegration`
   - Click **"Deploy"**

### Method 3: Deploy via CLI

```bash
# Make sure you're on the branch
git checkout frontendIntegration

# Install Vercel CLI (if not installed)
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

Or explicitly specify the branch:

```bash
vercel --prod --branch frontendIntegration
```

---

## ✅ Verify Deployment

After deployment, check:

- **Production URL:** `https://your-project.vercel.app`
- **Deployment Status:** Green checkmark in Vercel dashboard
- **Build Logs:** Check for any errors in the deployment logs

---

## 🔄 Continuous Deployment

Once configured, every push to `frontendIntegration` will automatically:

- Trigger a new production deployment (if set as production branch)
- Or create a preview deployment (if not set as production)

---

## 🆘 Troubleshooting

**Branch not showing in Vercel?**

- Make sure the branch is pushed to your Git repository
- Refresh the Vercel dashboard

**Build fails?**

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify `vercel.json` configuration

**Wrong branch deployed?**

- Go to Settings → Git → Change Production Branch from `main` to `frontendIntegration`
- Save changes - Vercel will automatically redeploy
- Or manually create deployment from correct branch

**Vercel keeps deploying main branch?**

- This is a common issue! See `FIX_VERCEL_BRANCH.md` for detailed steps
- Quick fix: Settings → Git → Production Branch → Change to `frontendIntegration` → Save
