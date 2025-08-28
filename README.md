# AgileFlow - Full-Stack Project Management Application

A modern, full-stack agile project management application built with React, NestJS, and Firebase.

## 🏗️ Project Structure

```
agile-flow/
├── frontend/                 # React application
├── backend/                  # NestJS API server
├── shared/                   # Shared types and utilities
├── firebase/                 # Firebase configuration and functions
├── docs/                     # Documentation
├── scripts/                  # Development and deployment scripts
└── docker-compose.yml        # Local development environment
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase CLI
- Git

### Initial Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd agile-flow
   npm run install:all
   ```

2. **Firebase Setup:**
   ```bash
   # Install Firebase CLI if not already installed
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Initialize Firebase project
   firebase init
   ```

3. **Environment Configuration:**
   ```bash
   # Copy environment templates
   cp frontend/.env.example frontend/.env.local
   cp backend/.env.example backend/.env
   
   # Configure your Firebase credentials in the .env files
   ```

4. **Start Development Servers:**
   ```bash
   # Start all services
   npm run dev
   
   # Or start individually
   npm run dev:frontend    # React app on http://localhost:3000
   npm run dev:backend     # NestJS API on http://localhost:3001
   ```

## 📁 Detailed Structure

### Frontend (React + TypeScript)
- **Authentication:** Firebase Auth integration
- **State Management:** React Context + Hooks
- **UI Components:** Material-UI
- **Real-time Updates:** Firestore listeners
- **Routing:** React Router v6

### Backend (NestJS + TypeScript)
- **Authentication:** Firebase Admin SDK
- **Database:** Firestore integration
- **API Documentation:** Swagger/OpenAPI
- **Validation:** Class-validator
- **Configuration:** Environment-based config

### Firebase Services
- **Authentication:** User management
- **Firestore:** Real-time database
- **Cloud Functions:** Automated workflows
- **Storage:** File uploads (future)

## 🔧 Development Scripts

```bash
# Install all dependencies
npm run install:all

# Development
npm run dev              # Start all services
npm run dev:frontend     # Start React app only
npm run dev:backend      # Start NestJS API only

# Building
npm run build           # Build all projects
npm run build:frontend  # Build React app
npm run build:backend   # Build NestJS API

# Testing
npm run test           # Run all tests
npm run test:frontend  # Test React app
npm run test:backend   # Test NestJS API

# Linting
npm run lint           # Lint all projects
npm run lint:fix       # Fix linting issues
```

## 📖 Documentation

- [Frontend Setup](./frontend/README.md)
- [Backend Setup](./backend/README.md)
- [Firebase Configuration](./docs/firebase-setup.md)
- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)

## 🏛️ Architecture

### Frontend Architecture
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API and Firebase services
├── contexts/           # React contexts
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Static assets
```

### Backend Architecture
```
src/
├── auth/               # Authentication module
├── projects/           # Projects CRUD
├── tasks/              # Tasks management
├── sprints/            # Sprint management
├── users/              # User management
├── common/             # Shared utilities
├── config/             # Configuration
└── firebase/           # Firebase integration
```

## 🎯 Features

### Current Features
- [x] User authentication (Firebase Auth)
- [x] Project management (CRUD)
- [x] Task management with Kanban board
- [x] Sprint management
- [x] Real-time updates
- [x] Responsive design

### Planned Features
- [ ] Team collaboration
- [ ] File attachments
- [ ] Advanced reporting
- [ ] Notifications
- [ ] Mobile app

## 🛡️ Security

- Environment variables for sensitive data
- Firebase security rules
- Input validation and sanitization
- JWT token verification
- CORS configuration

## 🚀 Deployment

See [Deployment Guide](./docs/deployment.md) for detailed instructions on deploying to various platforms.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
