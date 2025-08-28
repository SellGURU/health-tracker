# HolistiCare Application Documentation

## Table of Contents
1. [Application Overview](#application-overview)
2. [Core Features](#core-features)
3. [User Interface](#user-interface)
4. [Navigation Structure](#navigation-structure)
5. [Page Functionality](#page-functionality)
6. [Data Management](#data-management)
7. [Authentication System](#authentication-system)
8. [Design System](#design-system)
9. [Technical Architecture](#technical-architecture)
10. [API Endpoints](#api-endpoints)

## Application Overview

HolistiCare is a comprehensive AI-powered health monitoring and wellness platform that helps users track their health data, analyze biomarkers, and receive personalized health insights. The application combines biological age tracking, health coaching, educational resources, and action plan management into a unified mobile-first experience.

### Core Mission
- Empower users to take control of their health journey
- Provide data-driven insights for better health decisions
- Offer personalized recommendations based on individual health profiles
- Create engaging, gamified experiences to encourage healthy behaviors

## Core Features

### 1. Health Monitoring & Analytics
- **Biological Age Calculation**: Advanced algorithms determine biological age based on biomarker data
- **Health Score Tracking**: Real-time health scoring with progress indicators
- **Lab Results Management**: Upload and analyze lab reports (PDF, images)
- **Biomarker Tracking**: Monitor key health indicators with reference ranges
- **Trend Analysis**: Historical data visualization and pattern recognition

### 2. AI-Powered Deep Analysis
- **Comprehensive Health Reports**: AI-generated analysis of health data
- **Personalized Recommendations**: Tailored action items based on individual profiles
- **Risk Assessment**: Early identification of potential health concerns
- **Progress Monitoring**: Track improvements and changes over time

### 3. Health Coaching & Support
- **AI Health Copilot**: 24/7 available AI assistant for health questions
- **Human Coach Access**: Professional health coaching services
- **Chat Interface**: Real-time messaging with both AI and human coaches
- **Session Booking**: Schedule coaching sessions and consultations

### 4. Goal Setting & Action Plans
- **Personal Goals**: Set and track health, fitness, nutrition, and mental health goals
- **Challenge Participation**: Join community challenges for motivation
- **Action Plan Management**: Organized tasks and recommendations
- **Progress Tracking**: Visual progress indicators and completion metrics

### 5. Educational Resources
- **Health Articles**: Curated content on various health topics
- **Interactive Learning**: Engaging educational materials
- **Topic Requests**: Users can request specific health topics
- **Reading Plans**: Structured learning paths for health education

## User Interface

### Design Philosophy
The application implements a modern design system combining:
- **Neumorphism**: Soft shadows and raised effects for tactile feel
- **Glassmorphism**: Transparent panels with backdrop blur effects
- **Minimal Futuristic**: Clean typography with gradient text and neon accents
- **Gamification**: Progress bars, badges, and dynamic indicators

### Mobile-First Approach
- Optimized for mobile devices with responsive design
- Touch-friendly interface elements
- Bottom navigation for easy thumb access
- Swipe gestures and intuitive interactions

## Navigation Structure

### Bottom Navigation (Primary)
1. **Home** - Main dashboard and health overview
2. **Monitor** - Data tracking and lab results
3. **Chat** - AI copilot and coach communication
4. **Plan** - Goals, challenges, and action plans
5. **Educational** - Learning resources and articles

### Top Navigation (Secondary)
- **Profile Header**: User avatar, notifications, settings access
- **Search**: Global search functionality
- **Dark Mode Toggle**: Theme switching
- **Notifications**: Real-time alerts and updates

## Page Functionality

### Home Page (You Menu)
**Primary Functions:**
- **Age Display**: Shows both biological and chronological age
- **Health Summary**: Overall health score and key metrics
- **Latest Deep Analysis**: Recent AI analysis results with navigation
- **Quick Actions**: Direct access to chat and deep analysis
- **Your Plan**: Progress overview of current goals and action plans

**Interactive Elements:**
- Age cards with detailed breakdowns
- Progress bars with real-time updates
- Navigation between multiple analyses
- Quick action buttons for common tasks

### Monitor Page (Dashboard)
**Primary Functions:**
- **Lab Results Upload**: File upload and manual data entry
- **Biomarker Tracking**: Individual biomarker cards with trends
- **Health Score Display**: Comprehensive scoring system
- **Data Visualization**: Charts and graphs for trend analysis

**Data Management:**
- Support for PDF, JPG, PNG lab reports
- Manual biomarker entry with validation
- Historical data comparison
- Export capabilities

### Chat Page
**Primary Functions:**
- **Mode Selection**: Switch between AI Copilot and Human Coach
- **Real-time Messaging**: Instant communication interface
- **File Attachments**: Share images, documents, and data
- **Session Management**: Track conversation history

**Features:**
- **AI Copilot**: Instant responses, data analysis, recommendations
- **Human Coach**: Professional guidance, scheduled sessions
- **Coach Availability**: Real-time status indicators
- **Message Types**: Text, booking requests, file attachments

### Plan Page
**Primary Functions:**
- **Goal Management**: Create, track, and complete personal goals
- **Challenge Participation**: Join and monitor community challenges
- **Action Plans**: Organized task lists from AI analysis
- **Progress Tracking**: Visual indicators and completion metrics

**Goal Categories:**
- Health (cardiovascular, metabolic, preventive)
- Fitness (weight loss, strength, endurance)
- Nutrition (diet changes, meal planning)
- Mental Health (stress reduction, sleep improvement)

### Educational Page
**Primary Functions:**
- **Content Library**: Curated health articles and resources
- **Search & Filter**: Find content by topic, category, or tags
- **Reading Progress**: Track completion and save favorites
- **Interactive Learning**: Structured educational pathways

**Content Categories:**
- Health Science (biomarkers, aging, diagnostics)
- Lifestyle (sleep, stress, habits)
- Nutrition (diet, supplements, fasting)
- Fitness (exercise, movement, recovery)
- Mental Health (mindfulness, wellbeing)

## Data Management

### Health Data Types
1. **Lab Results**
   - Blood panels (CBC, CMP, lipid panels)
   - Hormone levels
   - Nutritional markers
   - Metabolic indicators

2. **Biomarkers**
   - Cardiovascular markers
   - Inflammatory markers
   - Metabolic health indicators
   - Nutritional status

3. **User Profiles**
   - Demographic information
   - Health history
   - Goals and preferences
   - Activity tracking

### Data Security
- Encrypted storage of all health information
- HIPAA-compliant data handling
- Secure API communications
- User consent management

## Authentication System

### User Management
- **Registration**: Email-based account creation
- **Authentication**: Session-based login system
- **Profile Management**: User preferences and settings
- **Data Privacy**: Granular privacy controls

### Test Account
```
Email: test@holisticare.com
Password: password123
```

## Design System

### Color Palette
- **Primary**: Blue to Purple gradients (#3B82F6 → #8B5CF6)
- **Secondary**: Emerald to Teal gradients (#10B981 → #14B8A6)
- **Accent**: Various themed gradients per feature
- **Neutral**: Gray scale with transparency effects

### Typography
- **Headers**: Thin font weights (font-thin) with gradient text
- **Body**: Medium weights for readability
- **Labels**: Light weights for secondary information

### Effects
- **Shadows**: Soft, layered shadows for depth
- **Blur**: Backdrop blur for glassmorphic effects
- **Gradients**: Smooth color transitions
- **Animations**: Subtle transitions and hover effects

## Technical Architecture

### Frontend Stack
- **React 18**: Component-based UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build system with HMR
- **Tailwind CSS**: Utility-first styling
- **TanStack Query**: Server state management
- **Wouter**: Lightweight routing

### Backend Stack
- **Express.js**: RESTful API server
- **TypeScript**: Server-side type safety
- **PostgreSQL**: Relational database
- **Drizzle ORM**: Type-safe database queries
- **Multer**: File upload handling

### Key Libraries
- **shadcn/ui**: Modern component library
- **Radix UI**: Accessible primitives
- **Lucide React**: Icon system
- **React Hook Form**: Form management
- **Zod**: Schema validation

## API Endpoints

### Health Data
```
GET /api/lab-results       - Retrieve lab results
POST /api/lab-results      - Upload new lab data
GET /api/health-score      - Get current health score
GET /api/trends            - Historical trend data
```

### User Management
```
GET /api/user/profile      - User profile data
PUT /api/user/profile      - Update profile
GET /api/user/goals        - User goals and progress
POST /api/user/goals       - Create new goals
```

### AI & Analysis
```
GET /api/insights          - AI-generated insights
POST /api/analysis/deep    - Request deep analysis
GET /api/action-plans      - Retrieve action plans
POST /api/action-plans     - Create action plans
```

### Communication
```
GET /api/chat/messages     - Chat history
POST /api/chat/messages    - Send message
GET /api/chat/coaches      - Available coaches
POST /api/chat/booking     - Book coaching session
```

## Deployment & Environment

### Development Setup
1. Node.js 20+ runtime
2. PostgreSQL database
3. Environment variables configuration
4. Package installation via npm

### Production Deployment
- Replit-optimized deployment
- Autoscaling configuration
- Database migrations
- Static asset serving

### Environment Variables
```
DATABASE_URL          - PostgreSQL connection string
PGHOST, PGPORT        - Database connection details
PGUSER, PGPASSWORD    - Database credentials
PGDATABASE            - Database name
```

## Future Enhancements

### Planned Features
1. **Wearable Integration**: Connect fitness trackers and smartwatches
2. **Advanced Analytics**: Machine learning predictions
3. **Social Features**: Community sharing and support
4. **Telemedicine**: Video consultations with healthcare providers
5. **Prescription Tracking**: Medication management and reminders

### Technical Improvements
1. **Offline Support**: Progressive Web App capabilities
2. **Real-time Sync**: WebSocket-based data synchronization
3. **Advanced Security**: Biometric authentication
4. **Performance**: Caching strategies and optimization
5. **Accessibility**: Enhanced screen reader support

---

*Last Updated: January 27, 2025*
*Version: 2.0.0*
*Documentation Status: Complete*