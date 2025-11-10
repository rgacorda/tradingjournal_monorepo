# Trading Journal Monorepo

A full-stack trading journal application built with Next.js (frontend) and Express.js (backend), managed with Turborepo.

## Project Structure

```
mono-repo/
├── packages/
│   ├── frontend/          # Next.js 15 + React 19 + TypeScript
│   └── backend/           # Express.js 5 + Sequelize + MySQL
├── package.json           # Root workspace configuration
├── turbo.json            # Turborepo pipeline configuration
└── README.md             # This file
```

## Prerequisites

- Node.js >= 18.0.0
- npm >= 10.0.0
- MySQL database

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

This installs Turborepo and all dependencies for both frontend and backend.

### 2. Configure Backend Environment

Create a `.env` file in `packages/backend/`:

```bash
cd packages/backend
cp .env.example .env
```

Edit the `.env` file with your configuration:
- Database credentials (MySQL)
- JWT secrets
- CORS origins
- Google OAuth credentials (if using Gmail features)

### 3. Run Development Mode

**Run both frontend and backend together:**
```bash
npm run dev
```

This starts:
- Backend API on `http://localhost:5001`
- Frontend on `http://localhost:3000`

**Run individually:**
```bash
# Backend only
npm run backend:dev

# Frontend only
npm run frontend:dev
```

## Available Commands

### Root Level Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both frontend and backend in development mode |
| `npm run build` | Build both projects for production |
| `npm run start` | Start both projects in production mode |
| `npm run lint` | Lint both projects |
| `npm run clean` | Clean build artifacts and node_modules |
| `npm run backend:dev` | Run only backend in development mode |
| `npm run frontend:dev` | Run only frontend in development mode |
| `npm run backend:start` | Start only backend in production mode |
| `npm run frontend:start` | Start only frontend in production mode |

### Backend Specific Commands

```bash
cd packages/backend

# Development
npm run dev

# Production
npm run start

# Gmail OAuth setup
npm run setup:gmail
```

### Frontend Specific Commands

```bash
cd packages/frontend

# Development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Technology Stack

### Frontend
- **Framework:** Next.js 15.3.1 with App Router
- **UI Library:** React 19.0.0
- **Language:** TypeScript 5
- **Styling:** TailwindCSS 4
- **State Management:** Zustand
- **Data Fetching:** SWR + Axios
- **Forms:** React Hook Form + Zod
- **UI Components:** Radix UI, Lucide Icons, Tabler Icons
- **Charts:** Recharts
- **Rich Text:** Tiptap

### Backend
- **Framework:** Express.js 5.1.0
- **Database:** MySQL with Sequelize ORM
- **Authentication:** JWT + bcryptjs
- **Email:** Nodemailer with Gmail OAuth
- **File Processing:** Multer, CSV Parser, XLSX
- **Scheduling:** Node-cron
- **Dev Tools:** Nodemon

## Development Workflow

### Adding Dependencies

**To frontend:**
```bash
npm install <package> --workspace=frontend
```

**To backend:**
```bash
npm install <package> --workspace=backend
```

**To root (dev tools):**
```bash
npm install <package> -D -w
```

### Database Setup

1. Create MySQL database named `trading_journal`
2. Update `packages/backend/.env` with database credentials
3. The backend will automatically sync models on startup

### Production Build

```bash
# Build both projects
npm run build

# Start in production mode
npm run start
```

## Features

### Frontend Features
- User authentication with JWT
- Interactive trading journal
- Dashboard with charts and analytics
- Trade management (CRUD operations)
- Account management
- Trading plan creation
- Import/export functionality
- Responsive design
- Dark mode support

### Backend Features
- RESTful API
- User authentication & authorization
- Trade CRUD operations
- Account management
- Trading plan management
- CSV/XLSX import
- Email notifications via Gmail
- Scheduled tasks (cron jobs)
- Secure cookie-based sessions

## Troubleshooting

### Port Already in Use

If you get a port conflict error:
- Backend runs on port 5001 (configurable in `.env`)
- Frontend runs on port 3000 (default Next.js port)

### Database Connection Issues

1. Ensure MySQL is running
2. Verify credentials in `packages/backend/.env`
3. Check that the database `trading_journal` exists

### Module Not Found Errors

Run `npm install` at the root level to reinstall all dependencies.

## Contributing

1. Make changes in the appropriate package
2. Test locally with `npm run dev`
3. Build with `npm run build` to ensure no errors
4. Commit and push changes

## License

ISC
