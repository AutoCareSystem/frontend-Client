# Fix: Vercel Deploying Main Branch Instead of frontendIntegration

## 🔧 Quick Fix (Recommended)

### Change Production Branch in Vercel Dashboard

1. **Go to your Vercel Project Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project

2. **Navigate to Settings**
   - Click on **Settings** tab (top navigation)
   - Click on **Git** in the left sidebar

3. **Change Production Branch**
   - Find **"Production Branch"** section
   - Change from `main` to `frontendIntegration`
   - Click **Save**

4. **Redeploy**
   - Vercel will automatically trigger a new deployment from `frontendIntegration` branch
   - Or go to **Deployments** tab and click **"Redeploy"** on the latest deployment

---

## 🚀 Alternative: Manual Deployment

If you want to deploy immediately without changing the production branch:

### Option 1: Deploy via Dashboard

1. Go to **Deployments** tab in Vercel
2. Click **"Create Deployment"** button (top right)
3. Select branch: `frontendIntegration`
4. Click **"Deploy"**

### Option 2: Deploy via CLI

```powershell
# Make sure you're on the correct branch
cd C:\Users\akind\OneDrive\Desktop\EAD\frontend_EAD
git checkout frontendIntegration

# Deploy to production from this branch
vercel --prod
```

Or explicitly specify the branch:
```powershell
vercel --prod --branch frontendIntegration
```

---

## ✅ Verify the Fix

After changing the production branch:

1. **Check Production Branch Setting**
   - Go to Settings → Git
   - Verify **Production Branch** shows `frontendIntegration`

2. **Test Automatic Deployment**
   - Make a small change to your code
   - Push to `frontendIntegration` branch:
     ```powershell
     git push backup frontendIntegration
     ```
   - Check Vercel dashboard - it should automatically deploy from `frontendIntegration`

3. **Check Deployment Source**
   - Go to **Deployments** tab
   - Click on any deployment
   - Check the **"Source"** - it should show `frontendIntegration` branch

---

## 📝 Important Notes

- **vercel.json** does NOT control which branch is deployed
- Branch selection is a **Vercel project setting**, not a code configuration
- Once changed, all future pushes to `frontendIntegration` will trigger production deployments
- Other branches will still create preview deployments

---

## 🆘 Still Having Issues?

If Vercel still deploys from `main`:

1. **Check Git Integration**
   - Settings → Git → Verify the correct repository is connected
   - Make sure `frontendIntegration` branch exists in the connected repo

2. **Force Redeploy**
   - Deployments → Create Deployment → Select `frontendIntegration` → Deploy

3. **Check Branch Protection**
   - Some repositories have branch protection rules
   - Make sure `frontendIntegration` is accessible

4. **Contact Vercel Support**
   - If issues persist, contact Vercel support with your project details

