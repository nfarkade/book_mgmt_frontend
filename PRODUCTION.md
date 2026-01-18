# Production Deployment Guide

This document outlines best practices and requirements for deploying this application to production.

## Pre-Deployment Checklist

### Environment Variables
- [ ] Create `.env.production` with production API URL
- [ ] Set `REACT_APP_ENVIRONMENT=production`
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up analytics if needed
- [ ] Verify API timeout settings

### Security
- [ ] Remove all console.log statements (or use proper logging service)
- [ ] Ensure no sensitive data in client-side code
- [ ] Verify HTTPS is enforced
- [ ] Review and update CORS settings on backend
- [ ] Enable Content Security Policy headers
- [ ] Review authentication token storage (consider httpOnly cookies)

### Performance
- [ ] Run production build: `npm run build`
- [ ] Test build locally
- [ ] Verify lazy loading works correctly
- [ ] Check bundle size (should be optimized)
- [ ] Enable gzip/brotli compression on server
- [ ] Set up CDN for static assets

### Testing
- [ ] All tests pass: `npm test`
- [ ] Code coverage meets threshold (70%+)
- [ ] Manual testing on staging environment
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing

### Monitoring
- [ ] Set up error tracking (Sentry recommended)
- [ ] Configure analytics
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation
- [ ] Set up performance monitoring

## Build Process

```bash
# Install dependencies
npm ci

# Run tests
npm test

# Build for production
npm run build

# The build folder contains production-ready files
```

## Deployment Options

### Static Hosting (Recommended)
- **Netlify**: Connect GitHub repo, set build command: `npm run build`, publish directory: `build`
- **Vercel**: Similar setup, automatic deployments
- **AWS S3 + CloudFront**: Upload build folder to S3, configure CloudFront
- **GitHub Pages**: Use `gh-pages` package

### Docker Deployment
```bash
# Build Docker image
docker build -t book-mgmt-frontend .

# Run container
docker run -p 80:80 book-mgmt-frontend
```

### Nginx Configuration
See `nginx.conf` for production-ready Nginx configuration.

## Environment Variables

Create `.env.production`:
```env
REACT_APP_API_BASE_URL=https://api.yourdomain.com
REACT_APP_ENVIRONMENT=production
REACT_APP_API_TIMEOUT=10000
REACT_APP_ENABLE_MOCK_DATA=false
```

## Error Tracking Setup

### Sentry (Recommended)
1. Install: `npm install @sentry/react`
2. Initialize in `src/index.js`:
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_ENVIRONMENT,
});
```

3. Wrap App with Sentry.ErrorBoundary

## Performance Optimization

### Already Implemented
- ✅ Code splitting with React.lazy
- ✅ Suspense for loading states
- ✅ Memoization hooks
- ✅ Debounced search inputs

### Additional Recommendations
- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Add service worker for offline support
- Optimize images (WebP format, lazy loading)
- Use CDN for static assets

## Security Headers

Add these headers in your server configuration:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Monitoring & Alerts

### Key Metrics to Monitor
- API response times
- Error rates
- Page load times
- User session duration
- Failed authentication attempts

### Recommended Tools
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics, Mixpanel
- **Uptime**: Pingdom, UptimeRobot
- **Performance**: Lighthouse CI, WebPageTest

## Rollback Plan

1. Keep previous build artifacts
2. Use blue-green deployment
3. Have database migration rollback scripts ready
4. Document rollback procedure

## Post-Deployment

- [ ] Verify all features work correctly
- [ ] Check error tracking is receiving events
- [ ] Monitor performance metrics
- [ ] Review logs for any issues
- [ ] Test critical user flows
- [ ] Verify API connectivity

## Support

For production issues:
1. Check error tracking dashboard
2. Review application logs
3. Check API status
4. Review recent deployments
