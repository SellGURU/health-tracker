# HealthTracker - Lab Results & Health Analytics Platform

## Overview

HealthTracker is a comprehensive web application designed to help users track and analyze their laboratory test results and health biomarkers. The platform enables users to upload lab reports, manually enter test data, visualize health trends over time, and receive personalized health insights and action plans.

## System Architecture

### Full-Stack Monorepo Structure
- **Frontend**: React/TypeScript with Vite build system
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Deployment**: Replit-optimized with autoscale deployment

### Directory Organization
```
├── client/          # React frontend application
├── server/          # Express.js backend API
├── shared/          # Shared TypeScript schemas and types
├── migrations/      # Database migration files
└── uploads/         # File upload storage directory
```

## Key Components

### Frontend Architecture
- **React 18** with TypeScript for type-safe component development
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management and caching
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with CSS variables for theming
- **Mobile-first responsive design** with bottom navigation pattern

### Backend Architecture
- **Express.js** server with TypeScript
- **Modular route organization** with centralized error handling
- **Multer** for handling file uploads (PDF, JPG, PNG lab reports)
- **bcrypt** for password hashing
- **Session-based authentication** with in-memory session store
- **CORS and security middleware** configured for production

### Database Design
- **PostgreSQL** as primary data store
- **Drizzle ORM** with type-safe schema definitions
- **Database schema** includes:
  - Users with health profile data (age, gender, height, weight)
  - Lab results with biomarker values and reference ranges
  - Biomarkers reference data with category organization
  - Health scores and trend tracking
  - Action plans and task management

## Data Flow

### Authentication Flow
1. User registration with health profile setup
2. Secure password hashing with bcrypt
3. Session token generation and management
4. Role-based access control (patient, healthcare_professional, admin)

### Lab Data Processing
1. **File Upload**: Users upload lab reports (PDF/images)
2. **Manual Entry**: Direct biomarker value input with validation
3. **Data Normalization**: Standardized units and reference ranges
4. **Trend Analysis**: Historical data comparison and visualization
5. **Health Scoring**: Algorithmic assessment of biomarker patterns

### Real-time Updates
- React Query for optimistic updates and cache invalidation
- Server-side validation with Zod schemas
- Error boundary handling for graceful failure recovery

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for Neon database
- **drizzle-orm & drizzle-kit**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI component primitives
- **multer**: File upload handling
- **bcrypt**: Password security

### Development Tools
- **Vite**: Fast build tool with HMR support
- **TypeScript**: Static type checking across frontend/backend
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing pipeline

### Replit-Specific Integrations
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit IDE integration

## Deployment Strategy

### Development Environment
- **Hot Module Replacement** via Vite dev server
- **TypeScript compilation** with incremental builds
- **Database migrations** with Drizzle Kit push commands
- **File uploads** stored locally in uploads directory

### Production Build Process
1. **Frontend Build**: Vite bundles React app to static assets
2. **Backend Build**: esbuild compiles TypeScript server to ESM
3. **Asset Serving**: Express serves static files from dist/public
4. **Database Setup**: Automated migration on deployment

### Replit Deployment Configuration
- **Autoscale deployment target** for dynamic scaling
- **Port 5000** mapped to external port 80
- **PostgreSQL-16 module** for database provisioning
- **Node.js 20** runtime environment
- **Build/start scripts** optimized for production

## Changelog

```
Changelog:
- June 18, 2025. Initial setup
- June 18, 2025. Enhanced font clarity with Inter font family and optimized text rendering
- June 18, 2025. Created test account with sample health data for UI testing
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
Font clarity: Requires sharp, clear text rendering across all UI elements.
Testing approach: Prefers test accounts with realistic data for UI validation.
```

## Test Credentials

```
Test Account:
Email: test@healthtracker.com
Password: password123

Includes: Lab results, health scores, action plans, and AI insights
```