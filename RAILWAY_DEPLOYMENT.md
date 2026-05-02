# Railway Deployment Guide for Docker Compose

This project is configured to deploy as a Docker Compose stack on Railway with:
- Next.js application in one container
- MongoDB in another container
- Automatic networking between containers

## Deployment Steps

1. **Remove old Railway services** (if redeploying):
   - Go to Railway dashboard
   - Remove the old "MongoDB" service
   - Remove the old "TeamTaskManager" service
   - This cleans up the separate services setup

2. **Update Railway project settings**:
   - Go to your Railway project settings
   - Under "Build & Development Settings", set:
     - Build Command: (leave empty or use default)
     - Root Directory: `.`

3. **Set Environment Variables in Railway**:
   ```
   JWT_SECRET=generate_a_random_string_at_least_32_chars
   NEXTAUTH_SECRET=generate_a_random_string_at_least_32_chars
   ADMIN_SIGNUP_KEY=your_admin_invite_key_here
   MONGO_USER=admin
   MONGO_PASSWORD=strong_password_change_this
   NODE_ENV=production
   NEXT_TELEMETRY_DISABLED=1
   ```

4. **Deploy**:
   - Push code to GitHub:
     ```bash
     git add .
     git commit -m "Railway docker-compose deployment"
     git push
     ```
   - Railway will automatically:
     - Detect docker-compose.yml
     - Build both MongoDB and app containers
     - Create internal networking
     - Start services in dependency order

5. **Verify deployment**:
   - Check Railway logs for: `Database connected successfully`
   - Check that both MongoDB and app services show as "Online"
   - Access your app at the Railway-provided URL
   - Test signup and project creation

## Troubleshooting

If app doesn't connect to MongoDB:
- Check Railway logs for connection errors
- Verify MONGODB_URI environment variable is set correctly
- Wait for MongoDB healthcheck to pass (first 30-40 seconds)
- Restart the services in Railway dashboard

If build fails:
- Clear Railway build cache
- Push a new commit to trigger fresh build
- Check Dockerfile for missing dependencies
