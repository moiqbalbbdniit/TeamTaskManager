# Team Task Manager

A full-stack web application for team collaboration where **admins** manage projects and assign tasks, and **members** track work progress and send reports.

## 🎯 Overview

Team Task Manager is built to simplify team workflows:
- **Admins** create projects, assign members, and manage tasks
- **Members** receive assigned tasks, send progress reports, and mark work complete
- **Real-time reports** and status tracking keep everyone aligned

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Context** for state management

### Backend
- **Next.js API Routes** (Route Handlers)
- **Node.js** runtime
- **MongoDB** with Mongoose ODM
- **JWT** authentication (HTTP-only cookies)
- **bcryptjs** for password hashing

### Database
- **MongoDB Atlas** (Cloud)
- Collections: Users, Projects, Tasks

---

## 📋 User Roles & Features

### 👨‍💼 ADMIN Role

**What Admins Can Do:**
- ✅ Create new projects
- ✅ View all projects they own or are members of
- ✅ Edit project details
- ✅ Delete projects
- ✅ Add/remove team members to projects
- ✅ Create tasks within projects
- ✅ **Assign tasks to members** (set assignee)
- ✅ Edit task details (title, description, priority, due date)
- ✅ Delete tasks
- ✅ View all reports from members
- ✅ View admin dashboard with team statistics
- ✅ Access admin panel

**Admin Dashboard Shows:**
- Total tasks in team
- Completed tasks count
- In-progress tasks count
- Overdue tasks count
- Task completion percentage
- Recent tasks across all projects

---

### 👥 MEMBER Role

**What Members Can Do:**
- ✅ View only projects assigned to them
- ✅ View tasks assigned to them (created by or assigned to)
- ✅ **Send progress reports** on assigned tasks (with optional status update)
- ✅ **Mark tasks as complete** when work is done
- ✅ View task details (title, description, priority, due date, assignee)
- ✅ View all reports/history on their tasks
- ✅ View personal dashboard with their assigned workload

**Member Dashboard Shows:**
- Total tasks assigned to them
- Completed tasks count
- In-progress tasks count
- Overdue tasks count
- Completion percentage for their work
- Recent tasks assigned to them

**What Members CANNOT Do:**
- ❌ Create projects
- ❌ Edit project settings
- ❌ Add/remove members
- ❌ Create or delete tasks
- ❌ Assign tasks to others
- ❌ Edit task details (except via reports)
- ❌ Delete tasks

---

## 🔐 Authentication & Signup

### Admin Signup

1. Navigate to `/signup`
2. Click **"Sign up as Admin"**
3. Fill in:
   - **Name** (your full name)
   - **Email** (unique email address)
   - **Password** (strong password)
   - **Confirm Password**
   - **Admin Invite Key** (required — see env setup below)
4. Click **"Create Admin Account"**
5. You'll be logged in and redirected to admin dashboard

**Admin Invite Key:**
- Stored in environment variable: `ADMIN_SIGNUP_KEY`
- Default (development): `admin123`
- Change this in production for security!

### Member Signup

1. Navigate to `/signup`
2. Click **"Sign up as Member"**
3. Fill in:
   - **Name**
   - **Email**
   - **Password**
   - **Confirm Password**
4. Click **"Create Account"**
5. You'll be logged in and redirected to member dashboard

**Note:** Members sign up without a special key. Admins add them to projects manually.

### Login

1. Navigate to `/login`
2. Enter **Email** and **Password**
3. Click **"Login"**
4. You'll be redirected to your dashboard (admin or member)

---

## 🎮 Admin Workflow

### Step 1: Create a Project

1. Log in as **Admin**
2. Go to **Projects** tab
3. Click **"New Project"** button
4. Fill in:
   - **Project Name** (e.g., "Website Redesign")
   - **Description** (e.g., "Redesign our portfolio website")
5. Click **"Create Project"**
6. You'll see the project details page

### Step 2: Add Team Members

1. On the project page, scroll to **"Add Member"** section
2. Enter a member's **Email** (they must have signed up first)
3. Click **"Add Member"**
4. The member is now part of the project with "member" role

### Step 3: Create & Assign Tasks

1. On the project page, click **"New Task"** button
2. Fill in:
   - **Title** (what needs to be done)
   - **Description** (detailed instructions)
   - **Priority** (Low, Medium, High)
   - **Due Date** (when it's due)
   - **Assign To** (select a member from dropdown)
3. Click **"Create Task"**
4. The member will see the task on their dashboard

### Step 4: Monitor Progress

1. Go to **Dashboard** to see team statistics
2. Click on any task to view its **Reports**
3. Members' reports show progress, blockers, and status updates
4. You can edit task details anytime

### Step 5: Manage Project

- **Edit Project:** Click "Edit" button on project page
- **Delete Project:** Click "Delete" button (all tasks deleted too)
- **Remove Member:** Click "Remove" next to member name in Members list
- **Delete Task:** Click "Delete" on task detail page

---

## 🎮 Member Workflow

### Step 1: Sign Up

1. Navigate to `/signup`
2. Click **"Sign up as Member"**
3. Complete signup form
4. You'll be directed to your member dashboard (currently empty)

### Step 2: Wait for Assignment

- Ask an admin to add you to a project
- Once added, you'll see projects in **Projects** tab
- Admin will create and assign tasks to you

### Step 3: View Assigned Tasks

1. Go to **Projects** tab
2. Click on a project to see its tasks
3. Only tasks **assigned to you** will appear
4. Click a task to open the detail page

### Step 4: Send Progress Reports

On an assigned task:

1. Scroll to **Reports** section
2. You'll see a **"Send Report"** form
3. Type a short message:
   - What you accomplished
   - Current blockers
   - Status update
   - Example: "Completed the hero section design. Waiting for copy from marketing."
4. Click **"Send Report"**
5. Your report is saved and visible to the admin

### Step 5: Mark Task as Complete

**Option 1: Via Report**
- In the report form, type a message and click "Send Report"
- Task status is automatically updated

**Option 2: Quick Complete Button**
- On the task page, click **"Mark Complete"** button
- Task status changes to "completed" immediately

### Step 6: View Your Dashboard

1. Go to **Dashboard** tab
2. See your personal statistics:
   - Total assigned tasks
   - Completed count
   - In-progress count
   - Overdue count
   - Completion percentage
3. See recent tasks assigned to you

---

## 🔧 Admin Panel Features

### Dashboard
- **Team Overview:** Total tasks, completed, in-progress, overdue
- **Metrics:** Completion percentage, team workload
- **Recent Activity:** Last tasks created/updated

### Projects Management
- **Create Projects:** Start new initiatives
- **View Projects:** All projects where you're owner or member
- **Edit Projects:** Update name and description
- **Delete Projects:** Remove entire project (careful!)
- **Member Management:** Add/remove team members

### Task Management
- **Create Tasks:** Define work to be done
- **Assign Tasks:** Specify which member does the work
- **Edit Tasks:** Update title, description, priority, due date
- **Delete Tasks:** Remove tasks
- **Monitor Reports:** View all member progress reports
- **View Reports:** See what each member is working on

### Team Members
- **Add Members:** Bring people into projects
- **View Member Info:** See email and role
- **Remove Members:** Take people off projects
- **Track Member Progress:** View their reported work

---

## 📊 Member Panel Features

### Dashboard
- **Personal Statistics:** Your assigned workload
- **Progress Tracking:** Completion percentage
- **Recent Tasks:** Tasks assigned to you recently
- **Status Overview:** How much work is done/pending

### Projects
- **View Projects:** See only projects you're part of
- **Project Details:** See project info and members
- **Task List:** Only your assigned tasks appear

### Tasks
- **View Assigned Tasks:** See what you need to do
- **Task Details:** Full description and due date
- **Send Reports:** Track progress on each task
- **Mark Complete:** Tell the admin when done
- **View Reports:** See history of your own reports

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection (Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=TeamTaskManager

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars

# NextAuth Secret (use a strong random string)
NEXTAUTH_SECRET=your_nextauth_secret_key_here_min_32_chars

# Admin Signup Key (change this for production!)
ADMIN_SIGNUP_KEY=admin123
```

**Getting MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get the connection string (mongodb+srv://...)
5. Replace `username:password` with your database credentials

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git installed

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd TeamTaskManager/fullstack
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env.local file with variables above
cp .env.example .env.local
# Edit .env.local with your actual values
```

4. **Run development server**
```bash
npm run dev
```

5. **Open browser**
```
http://localhost:3000
```

### Building for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (backend)
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── signup/route.ts
│   │   ├── dashboard/route.ts    # Dashboard statistics
│   │   ├── profile/route.ts      # User profile
│   │   ├── projects/             # Project endpoints
│   │   ├── tasks/                # Task endpoints
│   │   └── tasks/[id]/route.ts   # Individual task
│   ├── dashboard/page.tsx        # Dashboard UI
│   ├── login/page.tsx            # Login page
│   ├── signup/                   # Signup pages
│   │   ├── page.tsx              # Signup role chooser
│   │   ├── admin/page.tsx        # Admin signup form
│   │   └── member/page.tsx       # Member signup form
│   ├── admin/page.tsx            # Admin panel
│   ├── projects/                 # Projects pages
│   │   ├── page.tsx              # Projects list
│   │   ├── new/page.tsx          # Create project
│   │   └── [id]/                 # Project detail
│   └── tasks/                    # Tasks pages
│       └── [id]/page.tsx         # Task detail with reports
├── components/
│   ├── ProtectedLayout.tsx       # Auth wrapper
│   └── auth/SignupForm.tsx       # Reusable signup form
├── context/
│   └── AuthContext.tsx           # Auth state management
├── lib/
│   ├── auth.ts                   # JWT utilities
│   ├── db.ts                     # MongoDB connection
│   └── middleware.ts             # Auth middleware
└── models/
    ├── User.ts                   # User schema
    ├── Project.ts                # Project schema
    └── Task.ts                   # Task schema
```

---

## 🔄 Data Models

### User
```typescript
{
  _id: ObjectId
  name: string
  email: string (unique)
  password: string (hashed)
  role: 'admin' | 'member'
  createdAt: Date
  updatedAt: Date
}
```

### Project
```typescript
{
  _id: ObjectId
  name: string
  description: string
  owner: userId (reference to User)
  members: [
    { userId: userId, role: 'admin' | 'member' }
  ]
  createdAt: Date
  updatedAt: Date
}
```

### Task
```typescript
{
  _id: ObjectId
  title: string
  description: string
  project: projectId (reference to Project)
  assignee: userId | null (reference to User)
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate: Date | null
  reports: [
    {
      userId: userId (reference to User)
      message: string
      status: string (optional)
      createdAt: Date
    }
  ]
  createdBy: userId (reference to User)
  createdAt: Date
  updatedAt: Date
}
```

---

## 🔒 Security Features

- **Password Hashing:** Passwords hashed with bcryptjs
- **JWT Authentication:** Stateless token-based auth
- **HTTP-only Cookies:** Tokens stored securely
- **Protected Routes:** Auth check on every page
- **API Validation:** Input validation on all endpoints
- **Role-Based Access:** APIs enforce role permissions
- **Project Scoping:** Users only see their projects/tasks
- **Member Filtering:** Members see only their assigned work

---

## 🐛 Troubleshooting

### "Database connected successfully" but API returns 403
- Check if user has correct role
- Verify user is assigned to the project
- For members, check if they're the task assignee

### "Unauthorized" error
- JWT token expired → login again
- Check authToken cookie in browser DevTools
- Clear cookies and retry login

### MongoDB connection fails
- Verify MONGODB_URI in .env.local
- Check IP whitelist in MongoDB Atlas (allow all for dev)
- Ensure database user has correct credentials

### Admin signup says "Invalid invite key"
- Check ADMIN_SIGNUP_KEY in .env.local
- Make sure you typed it correctly
- Default is `admin123`

---

## 📝 API Endpoints Summary

### Auth
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Profile
- `GET /api/profile` - Get current user

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create project (admin only)
- `GET /api/projects/[id]` - Get project details
- `PUT /api/projects/[id]` - Update project (admin only)
- `DELETE /api/projects/[id]` - Delete project (owner only)
- `POST /api/projects/[id]/members` - Add member (admin only)
- `DELETE /api/projects/[id]/members` - Remove member (admin only)

### Tasks
- `GET /api/tasks?projectId=id` - List tasks (filtered by role)
- `POST /api/tasks` - Create task (member of project)
- `GET /api/tasks/[id]` - Get task details
- `PUT /api/tasks/[id]` - Update task (admin or assignee)
- `DELETE /api/tasks/[id]` - Delete task (admin or creator)

### Dashboard
- `GET /api/dashboard` - Get statistics (role-specific)

---

## 🚢 Deployment

### Deploy with Docker (Recommended)

**Local Docker Testing:**
```bash
# Build and run with docker-compose
docker-compose up --build

# Access the app
# App: http://localhost:3000
# MongoDB: mongodb://localhost:27017
```

**Environment Variables for Docker:**
```bash
# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb://admin:secure_password_123@mongodb:27017/teamtaskmanager?authSource=admin
JWT_SECRET=your_jwt_secret_key_here
NEXTAUTH_SECRET=your_nextauth_secret_here
ADMIN_SIGNUP_KEY=admin123
NODE_ENV=production
EOF
```

### Deploy to Vercel with Docker

1. **Push code to GitHub**
```bash
git add .
git commit -m "Docker containerized deployment"
git push origin main
```

2. **Connect to Vercel**
   - Go to [Vercel.com](https://vercel.com)
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose this GitHub repository
   - Click "Import"

3. **Configure Docker Build**
   - In Project Settings → Build & Development Settings:
     - Framework: **Other**
     - Build Command: `npm run build`
     - Output Directory: `.next`
   - Enable "Docker Build" in Advanced Settings

4. **Set Environment Variables**
   - In Settings → Environment Variables, add:
     - `MONGODB_URI` - Your MongoDB Atlas connection string (https://mongodb.com/cloud/atlas)
     - `JWT_SECRET` - Generate with: `openssl rand -base64 32`
     - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
     - `ADMIN_SIGNUP_KEY` - Your admin invite key (e.g., `admin_key_123`)
     - `NODE_ENV` - Set to `production`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~5-10 minutes)
   - Your app will be live at `https://<your-project>.vercel.app`

**Vercel + MongoDB Atlas Setup:**
- Use MongoDB Atlas free tier: https://mongodb.com/cloud/atlas
- Whitelist Vercel IP: Allow from anywhere (0.0.0.0/0) in MongoDB Atlas Network Access
- Connection string format: `mongodb+srv://username:password@cluster.mongodb.net/teamtaskmanager?retryWrites=true&w=majority`

### Alternative: Deploy to Railway.app

1. **Push code to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Railway**
   - Go to [Railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Select this repository

3. **Set environment variables** (same as Docker section above)

4. **Deploy**
   - Railway auto-deploys on git push
   - Visit your Railway project URL when ready

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the API endpoints documentation
3. Check MongoDB Atlas connection settings
4. Verify environment variables are set

---

## 📄 License

This project is open source and available under the MIT License.

---

**Happy task managing! 🎉**
