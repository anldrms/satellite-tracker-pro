# 🚀 Deployment Guide

Complete guide for deploying Satellite Tracker Pro to various platforms.

## Table of Contents
- [GitHub Pages](#github-pages-recommended)
- [Netlify](#netlify)
- [Vercel](#vercel)
- [Custom Server](#custom-server)

---

## GitHub Pages (Recommended)

### Automatic Deployment with GitHub Actions

This repository includes a pre-configured GitHub Actions workflow for automatic deployment.

#### Steps:

1. **Create a GitHub Repository**
   ```bash
   # In your terminal
   cd satellite-tracker-pro
   git remote add origin https://github.com/YOUR-USERNAME/satellite-tracker-pro.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click on **Settings** → **Pages**
   - Under "Build and deployment":
     - Source: **GitHub Actions**
   - The workflow will automatically deploy on push to `main`

3. **Wait for Deployment**
   - Go to the **Actions** tab to see the deployment progress
   - First deployment takes ~2-3 minutes
   - Your site will be live at: `https://YOUR-USERNAME.github.io/satellite-tracker-pro/`

4. **Verify**
   - Click the URL in the Actions log
   - Or visit: Settings → Pages to see the live URL

### Manual GitHub Pages Setup

If you prefer manual setup without Actions:

1. **Go to Settings → Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main` / `(root)`
4. **Click Save**
5. Wait 1-2 minutes
6. Visit: `https://YOUR-USERNAME.github.io/REPO-NAME/`

### Custom Domain

1. **Add CNAME file**:
   ```bash
   echo "yourdomain.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

2. **Configure DNS**:
   - Add A records pointing to GitHub's IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Or add CNAME record: `YOUR-USERNAME.github.io`

3. **Enable HTTPS** in GitHub Pages settings

---

## Netlify

### Quick Deploy

1. **Click this button**: [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

2. **Or manual deployment**:
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login
   netlify login
   
   # Deploy
   cd satellite-tracker-pro
   netlify deploy --prod
   ```

3. **Configure**:
   - Build command: (leave empty)
   - Publish directory: `.`

### Environment Variables
No environment variables needed! Everything runs client-side.

---

## Vercel

### Quick Deploy

1. **Import from GitHub**:
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

2. **Or use Vercel CLI**:
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   cd satellite-tracker-pro
   vercel
   ```

3. **Configure**:
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: `.`

---

## Custom Server

### Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    root /path/to/satellite-tracker-pro;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Apache

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /path/to/satellite-tracker-pro
    
    <Directory /path/to/satellite-tracker-pro>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Cache static files
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>
</VirtualHost>
```

### Docker

Create `Dockerfile`:

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:

```bash
docker build -t satellite-tracker .
docker run -d -p 8080:80 satellite-tracker
```

---

## Troubleshooting

### Common Issues

#### 1. **Blank page after deployment**
- Check browser console for errors
- Verify all CDN resources are loading
- Clear browser cache and hard refresh (Ctrl+Shift+R)

#### 2. **CelesTrak API not loading**
- Check your internet connection
- CelesTrak might be temporarily down
- Check browser console for CORS errors
- Try again in a few minutes

#### 3. **Cesium not loading**
- Verify the Cesium Ion token is valid
- Check if CDN is accessible
- Try using a different Cesium version if needed

#### 4. **GitHub Actions failing**
- Check the Actions log for specific errors
- Verify repository permissions
- Ensure Pages is enabled in settings

#### 5. **Performance issues**
- Reduce satellite count by adjusting `limit` in `app.js`
- Disable categories you don't need
- Try on a different device/browser

### Getting Help

If you encounter issues:
1. Check the [Issues](../../issues) page
2. Search for similar problems
3. Open a new issue with:
   - Browser and version
   - Error messages
   - Steps to reproduce

---

## Performance Optimization

### For Production

1. **Reduce Satellite Count**:
   Edit `app.js` and add/adjust `limit` values:
   ```javascript
   { name: 'Starlink', url: '...', color: '...', limit: 100 }
   ```

2. **Use Service Worker** (optional):
   Cache static assets for offline use

3. **Enable Compression**:
   - GitHub Pages: Automatic
   - Custom server: Enable gzip/brotli

4. **CDN Optimization**:
   - All dependencies already use CDNs
   - No build process needed

---

## Monitoring

### Check Deployment Status

**GitHub Pages**:
- Actions tab: See deployment logs
- Settings → Pages: See live URL and status

**Netlify**:
- Dashboard shows deployment status
- View logs and analytics

**Vercel**:
- Dashboard shows deployment status
- Real-time logs and analytics

---

## Updates

### Update Your Deployment

```bash
# Make changes to your code
git add .
git commit -m "Your update message"
git push origin main
```

GitHub Actions will automatically redeploy (if configured).

For manual deployments:
- **Netlify**: `netlify deploy --prod`
- **Vercel**: `vercel --prod`

---

## Security Notes

- ✅ No sensitive data or API keys needed
- ✅ All processing is client-side
- ✅ No database required
- ✅ HTTPS enabled by default on all platforms
- ✅ CORS-friendly (uses public APIs)

---

## Success Checklist

- [ ] Repository pushed to GitHub
- [ ] GitHub Pages enabled
- [ ] Deployment successful
- [ ] Site accessible via URL
- [ ] All satellites loading
- [ ] UI responding correctly
- [ ] Mobile responsive working
- [ ] No console errors

---

**Need more help?** Open an issue or check the [README](README.md)!

🛰️ Happy satellite tracking!
