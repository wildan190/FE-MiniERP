# 🚀 Deployment Guide - Frontend MiniERP

## Deployment Checklist

- [ ] Project builds successfully
- [ ] All TypeScript errors resolved
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Backend API accessible
- [ ] CORS properly configured
- [ ] Error handling tested
- [ ] Performance tested
- [ ] Security review passed
- [ ] Documentation reviewed

---

## 📦 Building for Production

### Step 1: Prepare Build
```bash
cd /Users/wildanbelfiore/FE-MiniERP

# Clean previous builds (optional)
rm -rf dist

# Install dependencies
npm install

# Type check
npm run type-check

# Lint check
npm run lint
```

### Step 2: Build
```bash
npm run build
```

Expected output:
```
✓ 123 modules transformed.
dist/index.html                  0.45 kB │ gzip:  0.30 kB
dist/assets/index-xxxxx.js       125.34 kB │ gzip: 45.23 kB
dist/assets/index-xxxxx.css      15.67 kB │ gzip: 3.45 kB
✓ built in 12.34s
```

### Step 3: Preview Build (Optional)
```bash
npm run preview
```

---

## 🌐 Deployment Platforms

### Option 1: Vercel (Recommended)

**Advantages**: Easiest deployment, auto HTTPS, fast, free tier

#### Steps:
1. Push to GitHub
2. Connect GitHub to Vercel
3. Select repository
4. Framework: Vue.js
5. Build command: `npm run build`
6. Output directory: `dist`
7. Environment variables: Add backend URL
8. Deploy!

**Environment Variables:**
```
VITE_API_BASE_URL=https://your-api.com
```

---

### Option 2: Netlify

**Advantages**: Great UI, good integration, free tier

#### Steps:
1. Push to GitHub
2. Connect to Netlify
3. Select repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Environment variables: Add backend URL
7. Deploy!

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_API_BASE_URL = "https://your-api.com"
```

---

### Option 3: GitHub Pages

**Advantages**: Free, integrated with GitHub

#### Steps:
1. Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/repository-name/',
  // ... rest of config
})
```

2. Add GitHub Actions workflow:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

### Option 4: AWS S3 + CloudFront

**Advantages**: Scalable, reliable, enterprise-ready

#### Steps:
1. Build project: `npm run build`
2. Create S3 bucket
3. Upload `dist` contents
4. Create CloudFront distribution
5. Point to S3 bucket
6. Set up CORS
7. Deploy!

---

### Option 5: Self-Hosted Server

**Advantages**: Full control, no vendor lock-in

#### With Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/minierp;
        try_files $uri $uri/ /index.html;
    }

    location ~ \.(js|css|png|jpg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /var/www/minierp;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### With Apache:
```apache
<Directory /var/www/minierp>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</Directory>
```

---

## 🔧 Environment Configuration

### Create `.env.production`

```env
# API Configuration
VITE_API_BASE_URL=https://api.your-domain.com

# Application
VITE_APP_NAME=MiniERP

# Optional
VITE_LOG_LEVEL=error
```

### Build with Environment
```bash
# Production build
npm run build

# Build will use .env.production
```

---

## 🛡️ Security Checklist

- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] CSP headers set
- [ ] Security headers configured
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
- [ ] Input validation in place
- [ ] API authentication enabled
- [ ] Error messages don't leak info
- [ ] Dependencies up to date

---

## 🚀 Performance Optimization

### Enable Compression
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### Set Cache Headers
```nginx
location ~* \.(js|css|png|jpg|gif|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location / {
    expires 1h;
    add_header Cache-Control "public";
}
```

### Use CDN
- CloudFront (AWS)
- Cloudflare
- BunnyCDN
- KeyCDN

---

## 📊 Post-Deployment Checklist

After deployment:

- [ ] Test login functionality
- [ ] Test all routes work
- [ ] Test API connectivity
- [ ] Test error handling
- [ ] Test on different browsers
- [ ] Test on different devices
- [ ] Check console for errors
- [ ] Verify performance
- [ ] Check SEO meta tags
- [ ] Set up monitoring
- [ ] Set up error tracking
- [ ] Set up analytics

---

## 🔍 Monitoring & Maintenance

### Set Up Monitoring

**Error Tracking:**
- Sentry
- Bugsnag
- Rollbar
- LogRocket

**Analytics:**
- Google Analytics
- Mixpanel
- Amplitude
- Heap

**Performance Monitoring:**
- New Relic
- Datadog
- Scout APM
- Dynatrace

### Regular Maintenance

```bash
# Weekly
npm audit fix
npm update

# Monthly
npm run type-check
npm run lint

# Quarterly
Security review
Performance audit
Dependency updates
```

---

## 🚨 Troubleshooting Deployment

### Issue: Blank Page

**Causes:**
- JavaScript not loading
- CSS not loading
- Build output incorrect

**Solutions:**
1. Check browser console for errors
2. Verify build output in `dist/`
3. Check `index.html` exists
4. Verify asset paths in HTML
5. Check web server configuration

### Issue: API Not Working

**Causes:**
- Backend not accessible
- CORS not configured
- Environment variables wrong

**Solutions:**
1. Check API endpoint in env variables
2. Test backend is running
3. Check CORS headers
4. Verify network requests in DevTools

### Issue: Routing Not Working

**Causes:**
- SPA routing not configured
- Web server doesn't handle client-side routing

**Solutions:**
1. Configure web server for SPA
2. All routes should fallback to `index.html`
3. Client-side router handles routing

### Issue: Assets Not Loading

**Causes:**
- Base path incorrect
- Asset paths wrong
- Assets not in dist/

**Solutions:**
1. Check base path in vite.config.ts
2. Verify assets in dist/
3. Check web server serves assets
4. Check cache headers

---

## 📱 Mobile Deployment

### iOS (via App Wrapper)
- Use Capacitor
- Use React Native Web
- Use Expo Web

### Android (via App Wrapper)
- Use Capacitor
- Use React Native Web
- Use NativeScript

### Progressive Web App (PWA)
```bash
npm install workbox-webpack-plugin
```

---

## 💰 Cost Estimation

### Free Tier Options
- **Vercel**: Free tier with good limits
- **Netlify**: Free tier with good limits
- **GitHub Pages**: Free (public repos only)
- **Firebase Hosting**: Free tier

### Paid Options
- **Vercel Pro**: $20/month + usage
- **Netlify Pro**: $19/month + usage
- **AWS**: Pay-as-you-go (usually $5-20/month)
- **DigitalOcean**: $6-40/month droplets

---

## 🎯 Recommended Deployment Stack

For best results:

1. **Repository**: GitHub
2. **CI/CD**: GitHub Actions (free)
3. **Hosting**: Vercel or Netlify (free)
4. **CDN**: Included with Vercel/Netlify
5. **Domain**: Namecheap (~$10/year)
6. **SSL**: Let's Encrypt (free)
7. **Monitoring**: Sentry free tier
8. **Analytics**: Google Analytics (free)

**Total Cost**: ~$10/year

---

## 📞 Support During Deployment

If issues arise:

1. Check logs and error messages
2. Review deployment checklist
3. Test locally: `npm run build && npm run preview`
4. Review configuration
5. Check documentation
6. Ask support of hosting provider

---

## ✨ Final Steps

1. ✅ Build successfully
2. ✅ Deploy to staging
3. ✅ Test thoroughly
4. ✅ Deploy to production
5. ✅ Monitor for errors
6. ✅ Celebrate! 🎉

---

**Last Updated**: February 6, 2026  
**Status**: Ready for Deployment
