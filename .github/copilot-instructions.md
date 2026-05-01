# Team Task Manager - Project Documentation

This is a full-stack Team Task Manager application demonstrating key web development concepts.

## Architecture Overview

### Frontend
- **Next.js 14** with TypeScript
- **React Context** for authentication state management
- **Tailwind CSS** for styling
- **Axios** for API communication

### Backend
- **Next.js API Routes** for REST endpoints
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing

### Database
- **MongoDB Atlas** for production
- Collections: Users, Projects, Tasks

## Key Features Implemented

### 1. Authentication System
- User signup with password hashing
- JWT-based login/logout
- Protected routes with session management
- HTTP-only secure cookies

### 2. Project Management
- Create, read, update, delete projects
- Add/remove team members
- Owner and member roles
- Project-based access control

### 3. Task Management
- Task CRUD operations
- Task assignment to team members
- Status tracking (To Do, In Progress, Completed)
- Priority levels (Low, Medium, High)
- Due date management
- Task filtering by project

### 4. Dashboard
- Overview statistics (total, completed, in-progress, overdue tasks)
- Task completion percentage
- Recent tasks list
- Project count

### 5. Role-Based Access Control
- Admin: Full project access and member management
- Member: Can view and update their assigned tasks
- Owner: Can delete projects and manage team

## API Endpoints Summary

### Authentication
- POST `/api/auth/signup` - Register user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user

### Projects
- GET `/api/projects` - List user's projects
- POST `/api/projects` - Create project
- GET `/api/projects/[id]` - Get project details
- PUT `/api/projects/[id]` - Update project
- DELETE `/api/projects/[id]` - Delete project
- POST `/api/projects/[id]/members` - Add member
- DELETE `/api/projects/[id]/members` - Remove member

### Tasks
- GET `/api/tasks` - List tasks
- POST `/api/tasks` - Create task
- GET `/api/tasks/[id]` - Get task details
- PUT `/api/tasks/[id]` - Update task
- DELETE `/api/tasks/[id]` - Delete task

### Dashboard
- GET `/api/dashboard` - Get dashboard statistics

## Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Server runs on `http://localhost:3000`

## Environment Variables

Required for deployment:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `NEXTAUTH_SECRET` - NextAuth session secret
- `NODE_ENV` - Environment (development/production)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── projects/         # Projects management
│   ├── tasks/            # Tasks management
│   └── layout.tsx        # Root layout
├── components/            # React components
│   └── ProtectedLayout.tsx
├── context/              # Context providers
│   └── AuthContext.tsx
├── lib/                  # Utilities
│   ├── auth.ts
│   ├── db.ts
│   └── middleware.ts
├── models/              # Mongoose schemas
│   ├── User.ts
│   ├── Project.ts
│   └── Task.ts
└── app/
    └── globals.css      # Global styles
```

## Database Models

### User
- Stores user credentials with hashed passwords
- Role field for basic access control
- Timestamps for audit trail

### Project
- Owner reference to User
- Members array with userId and role
- Description for project details
- Timestamps

### Task
- Project reference
- Assignee reference (optional)
- Status tracking
- Priority levels
- Created by tracking
- Due date field
- Timestamps

## Security Features

- Password hashing with bcryptjs
- JWT authentication with expiration
- HTTP-only secure cookies
- Protected API routes
- Database connection pooling
- Environment variable protection
- Input validation
- CORS-ready architecture

## Deployment

The application is designed for Railway.app deployment:
1. Push code to GitHub
2. Connect repository to Railway
3. Set environment variables
4. Deploy automatically on push

See [Railway Deployment Guide](https://docs.railway.app) for details.
