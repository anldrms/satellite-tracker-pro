# 🚀 GitHub Setup Instructions

Your code is ready! Follow these steps to deploy to GitHub Pages.

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `satellite-tracker-pro` (or any name you want)
3. Description: "Real-time 3D satellite tracker with 500+ satellites"
4. Make it **Public** (required for free GitHub Pages)
5. **DO NOT** initialize with README, .gitignore, or license (we already have them)
6. Click "Create repository"

## Step 2: Push Your Code

Copy and run these commands in your terminal:

```bash
cd ~/satellite-tracker-pro

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR-USERNAME/satellite-tracker-pro.git

# Push the code
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username!

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - Source: Select **GitHub Actions**
5. That's it! The workflow will automatically run.

## Step 4: Wait for Deployment

1. Click the **Actions** tab in your repository
2. You'll see a workflow running called "Deploy to GitHub Pages"
3. Wait 2-3 minutes for it to complete
4. Once complete, go back to Settings → Pages
5. You'll see: "Your site is live at https://YOUR-USERNAME.github.io/satellite-tracker-pro/"

## Step 5: Visit Your Live Site! 🎉

Your satellite tracker is now live at:
```
https://YOUR-USERNAME.github.io/satellite-tracker-pro/
```

---

## Alternative: Manual Pages Setup

If you don't want to use GitHub Actions:

1. Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: **main** / **(root)**
4. Click Save
5. Wait 1-2 minutes
6. Visit your site!

---

## Troubleshooting

### "Permission denied" error
- Make sure you're logged into GitHub
- Check your GitHub username in the remote URL
- Try: `git remote set-url origin https://github.com/YOUR-USERNAME/satellite-tracker-pro.git`

### Repository already exists
- Either delete the old repo or use a different name
- Update the remote URL accordingly

### Pages not deploying
- Make sure repository is public
- Check the Actions tab for error logs
- Verify Pages is enabled in Settings

---

## Quick Commands Summary

```bash
# 1. Add remote
git remote add origin https://github.com/YOUR-USERNAME/satellite-tracker-pro.git

# 2. Push code
git push -u origin main

# 3. Check status
git status

# 4. Make changes and update
git add .
git commit -m "Your changes"
git push
```

---

## What Happens Next?

- Every time you push to `main`, GitHub Actions automatically redeploys
- Your site updates within 1-2 minutes
- No manual deployment needed!

---

## Need Help?

1. Check repository Actions tab for deployment logs
2. Verify Settings → Pages shows the correct configuration
3. Make sure repository is public
4. Clear browser cache and try again

🛰️ **Your professional satellite tracker is ready for the world!**
