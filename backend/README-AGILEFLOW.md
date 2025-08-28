# AgileFlow Backend

A NestJS-based backend API for the AgileFlow project management application.

## 🚀 Features

- **Authentication**: Firebase Admin SDK integration
- **Projects**: CRUD operations for project management
- **Real-time Data**: Firestore integration
- **API Documentation**: Swagger/OpenAPI documentation
- **Type Safety**: Full TypeScript support
- **Validation**: Request/response validation with class-validator
- **Security**: JWT token verification and role-based access

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project with Firestore and Authentication enabled

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your Firebase configuration.

## 🚀 Running the Application

### Development
```bash
# Start in development mode with hot reload
npm run start:dev
```

### Production
```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

## 📚 API Documentation

Once the server is running, access:

- **API Documentation**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/api/health

## 🔐 Authentication

The API uses Firebase JWT tokens. Include the token in the Authorization header:

```bash
Authorization: Bearer <firebase_jwt_token>
```
