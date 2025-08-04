# Nivo - Customer experience software

![Dashboard](client/src/assets/dashboard.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-%5E18.3.1-blue)](https://reactjs.org/)

Nivo is a customer experience software that helps businesses manage customer flow and reduce waiting times.

## 🚀 Features

### Core Functionality
- **Real-time Queue Management** - Live updates for instant synchronization
- **Smart Appointment Scheduling** - Advanced booking system with time slot management
- **Customer Self-Service** - QR code-based self-registration and check-in
- **Multi-Channel Support** - Web dashboard and customer-facing interfaces
- **Business Analytics** - Comprehensive insights into queue performance and customer behavior

### Technical Features
- **Responsive Design** - Works seamlessly across desktop, tablet, and mobile devices
- **Multi-tenant Architecture** - Support for multiple businesses with isolated data
- **RESTful API** - Well-documented API for integrations and extensions
- **Security First** - JWT authentication, password hashing, and data validation

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development experience
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Interactive analytics and data visualization

### Backend
- **Bun** - Fast JavaScript runtime and package manager
- **TypeScript** - Type-safe JavaScript development
- **Express.js** - Fast, minimalist web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling for Node.js
- **Zod** - TypeScript-first schema validation
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing library

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Bun** (v1.0.0 or higher) - Fast JavaScript runtime and package manager
- **Node.js** (v18.0.0 or higher) - For frontend development
- **MongoDB** (v5.0 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/nivo.git
cd nivo
```

### 2. Backend Setup

```bash
cd back

# Install dependencies
bun install

# Create environment file
cp .env.example .env

# Configure your environment variables
# Edit .env with your MongoDB connection string and other settings

# Start the backend server
bun run dev

# Optional: Create an admin user
bun run create-admin
```

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 4. Database Setup

Make sure MongoDB is running on your system. The application will automatically create the necessary collections on first run.

## 🛠️ Development Commands

### Backend (TypeScript + Bun)
```bash
cd back

# Development server with auto-reload
bun run dev

# Build the project
bun run build

# Format code
bun run format

# Lint code
bun run lint

# Create admin user
bun run create-admin
```

### Frontend (React + Vite)
```bash
cd client

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=5000

# JWT Configuration  
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production

# MongoDB Configuration
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-db-name

```

## 🏗️ Project Structure

```
nivo/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   └── package.json        # Frontend dependencies
│
├── back/                   # TypeScript + Bun backend application
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API route definitions
│   │   ├── models/         # Mongoose database models
│   │   ├── middlewares/    # Express middleware
│   │   ├── schemas/        # Zod validation schemas
│   │   ├── interfaces/     # TypeScript interfaces
│   │   ├── config/         # Configuration files
│   │   └── utils/          # Utility functions
│   ├── docs/               # API documentation
│   ├── index.ts           # Main server file
│   ├── package.json       # Backend dependencies
│   └── biome.json         # Code formatting and linting
│
├── backend/                # Legacy JavaScript backend (deprecated)
│
└── README.md              # This file
```

## 📖 API Documentation

Base URL: `/api/v1`

### Authentication Endpoints

```http
POST /api/v1/user/signup        # Register new business
POST /api/v1/user/login         # Login user
GET  /api/v1/user/profile       # Get current user profile
GET  /api/v1/user/patient-stats # Get patient statistics
PUT  /api/v1/user/business-hours # Update business hours
```

### Queue Management

```http
GET    /api/v1/queue/waitlist       # Get current waitlist
GET    /api/v1/queue/serving        # Get currently serving patients
POST   /api/v1/queue/patient        # Add patient to queue (authenticated)
POST   /api/v1/queue/customeradd/:userId # Add customer to specific user's queue (public)
PUT    /api/v1/queue/patient/:id/serve    # Move patient from waiting to serving
PUT    /api/v1/queue/patient/:id/complete # Complete patient consultation
GET    /api/v1/queue/patient/:id    # Get patient details
GET    /api/v1/queue/allpatient     # Get all patients
```

### Appointments

```http
GET    /api/v1/appointment/available-slots/:userId/:date # Get available time slots
POST   /api/v1/appointment/book/:userId                  # Book appointment (public)
POST   /api/v1/appointment/add-booking                   # Add booking (authenticated)
GET    /api/v1/appointment/user-appointments             # Get user's appointments
GET    /api/v1/appointment/today-bookings                # Get today's bookings
PUT    /api/v1/appointment/cancel/:appointmentId         # Cancel appointment
```

### Business Management

```http
GET    /api/v1/user/queue-status/:userId           # Get queue status for specific user
GET    /api/v1/user/businessName/:userId           # Get business name by user ID
GET    /api/v1/user/get-user-by-business/:businessNameForUrl # Get user by business URL
```

---

**Made with ❤️ for efficient business management**
