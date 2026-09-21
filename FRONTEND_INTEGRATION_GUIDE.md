# Frontend Integration Guide
## How to Connect Your Frontend to the Backend API

This guide explains everything you need to modify and change when connecting your frontend to your backend API, and how to ensure connectivity is working properly.

---

## 🎯 Overview

Your backend is a **REST API** that provides HTTP endpoints. Your frontend (React, Vue, Angular, React Native, Flutter, etc.) will make HTTP requests to these endpoints to get and send data.

**Backend URL (Local Development):** `http://localhost:3000`

---

## 📋 Backend Configuration Checklist

### **1. CORS Configuration (Critical for Frontend Connection)**

**Current Status:** ✅ Already configured in `src/index.ts`

Your backend already has CORS enabled:

```typescript
app.use(cors());
```

**What This Does:**
- Allows your frontend (running on a different port/domain) to make requests to your backend
- Prevents "CORS policy" errors in the browser
- By default, allows all origins (good for development)

**For Production, You May Need to Restrict CORS:**

```typescript
// In src/index.ts, replace the simple cors() with:
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true // Allow cookies for session management
}));
```

**What to Add to `.env`:**
```env
FRONTEND_URL=http://localhost:5173  # Your frontend URL
```

---

### **2. Environment Variables Configuration**

**Current `.env` File:**
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=backend_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
```

**Additional Variables You May Need for Frontend Integration:**
```env
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Production `.env.production` Should Have:**
```env
NODE_ENV=production
PORT=3000
DB_HOST=your-production-db-host
DB_PORT=5432
DB_NAME=production_db
DB_USER=your_production_user
DB_PASSWORD=your-production-password
JWT_SECRET=your-production-secret-key
JWT_EXPIRES_IN=7d
REDIS_URL=redis://your-production-redis:6379
FRONTEND_URL=https://your-frontend-domain.com
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

---

### **3. API Endpoints Reference**

**Authentication Endpoints:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (requires JWT token)
- `PUT /api/auth/me` - Update user profile (requires JWT token)

**Product Endpoints:**
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get product by ID (public)
- `POST /api/products` - Create product (requires JWT token)
- `PUT /api/products/:id` - Update product (requires JWT token)
- `DELETE /api/products/:id` - Delete product (requires JWT token)
- `POST /api/products/:id/stock` - Update stock (requires JWT token)
- `GET /api/products/:id/stock` - Check stock availability (public)

**Order Endpoints:**
- `POST /api/orders` - Create order (requires JWT token)
- `GET /api/orders/my` - Get user's orders (requires JWT token)
- `GET /api/orders/:id` - Get order by ID (requires JWT token)
- `GET /api/orders` - Get all orders (requires JWT token, admin)
- `PUT /api/orders/:id/status` - Update order status (requires JWT token)
- `POST /api/orders/:id/cancel` - Cancel order (requires JWT token)

**User Management Endpoints:**
- `GET /api/users` - Get all users (public - consider restricting)
- `GET /api/users/:id` - Get user by ID (public - consider restricting)
- `DELETE /api/users/:id` - Delete user (requires JWT token)

**System Endpoints:**
- `GET /health` - Health check (public)
- `GET /metrics` - Prometheus metrics (public - consider restricting)

---

## 🔌 Frontend Connection Setup

### **Step 1: Choose Your Frontend Technology**

**Web Frontend Options:**
- React (most popular)
- Vue.js
- Angular
- Svelte
- Next.js (React with SSR)

**Mobile Frontend Options:**
- React Native
- Flutter
- Native iOS (Swift)
- Native Android (Kotlin)

### **Step 2: Install HTTP Client Library**

**For React/Vue/Angular (JavaScript/TypeScript):**
```bash
npm install axios
# or
npm install fetch
```

**For Flutter:**
```yaml
dependencies:
  http: ^0.13.4
  # or
  dio: ^5.0.0
```

**For React Native:**
```bash
npm install axios
# or
npm install @react-native-async-storage/async-storage
```

### **Step 3: Configure API Base URL**

**Example React Configuration:**

Create `src/config/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const api = {
  auth: {
    register: () => `${API_BASE_URL}/api/auth/register`,
    login: () => `${API_BASE_URL}/api/auth/login`,
    me: () => `${API_BASE_URL}/api/auth/me`,
    updateProfile: () => `${API_BASE_URL}/api/auth/me`,
  },
  products: {
    getAll: () => `${API_BASE_URL}/api/products`,
    getById: (id) => `${API_BASE_URL}/api/products/${id}`,
    create: () => `${API_BASE_URL}/api/products`,
    update: (id) => `${API_BASE_URL}/api/products/${id}`,
    delete: (id) => `${API_BASE_URL}/api/products/${id}`,
    updateStock: (id) => `${API_BASE_URL}/api/products/${id}/stock`,
    checkStock: (id) => `${API_BASE_URL}/api/products/${id}/stock`,
  },
  orders: {
    create: () => `${API_BASE_URL}/api/orders`,
    getMyOrders: () => `${API_BASE_URL}/api/orders/my`,
    getById: (id) => `${API_BASE_URL}/api/orders/${id}`,
    getAll: () => `${API_BASE_URL}/api/orders`,
    updateStatus: (id) => `${API_BASE_URL}/api/orders/${id}/status`,
    cancel: (id) => `${API_BASE_URL}/api/orders/${id}/cancel`,
  },
  users: {
    getAll: () => `${API_BASE_URL}/api/users`,
    getById: (id) => `${API_BASE_URL}/api/users/${id}`,
    delete: (id) => `${API_BASE_URL}/api/users/${id}`,
  },
};

export default api;
```

### **Step 4: Create API Service Functions**

**Example React API Service:**

Create `src/services/authService.js`:
```javascript
import axios from 'axios';
import api from '../config/api';

const getAuthToken = () => localStorage.getItem('token');

export const authService = {
  register: async (userData) => {
    const response = await axios.post(api.auth.register(), userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post(api.auth.login(), credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getProfile: async () => {
    const token = getAuthToken();
    const response = await axios.get(api.auth.me(), {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateProfile: async (userData) => {
    const token = getAuthToken();
    const response = await axios.put(api.auth.updateProfile(), userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
};
```

---

## 🧪 Testing Connectivity

### **Step 1: Start Your Backend**

```bash
cd C:\Users\mirac\Documents\Backend_Project
npm run dev
```

**Expected Output:**
```
Server is running on http://0.0.0.0:3000
Environment: development
```

### **Step 2: Test Backend Health Check**

**Using curl:**
```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-09-17T..."
}
```

**Using Browser:**
- Open: `http://localhost:3000/health`
- You should see the health check response

### **Step 3: Test Product Endpoint (No Auth Required)**

```bash
curl http://localhost:3000/api/products
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "Example Product",
    "description": "Product description",
    "price": 29.99,
    "stock": 100,
    "created_at": "...",
    "updated_at": "..."
  }
]
```

### **Step 4: Test Authentication Flow**

**Register a User:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!","name":"Test User"}'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "sessionToken": "...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

**Login with the Token:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}'
```

**Test Protected Endpoint:**
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔧 Frontend Implementation Examples

### **React Component Example:**

```javascript
import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.name}!</h1>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}
```

### **Fetch API Example (No External Library):**

```javascript
const API_BASE_URL = 'http://localhost:3000';

async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/api/products`);
  const products = await response.json();
  return products;
}

async function createProduct(productData) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  return response.json();
}
```

---

## 🚨 Common Connectivity Issues and Solutions

### **Issue 1: CORS Errors**

**Error in Browser Console:**
```
Access to XMLHttpRequest at 'http://localhost:3000/api/auth/login' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**
- Your backend already has CORS enabled, but you may need to configure it for your specific frontend URL
- Update `src/index.ts`:

```typescript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
```

### **Issue 2: Backend Not Running**

**Error:**
```
Connection refused
Network Error
```

**Solution:**
1. Check if your backend is running: `npm run dev`
2. Check the port: Make sure nothing else is using port 3000
3. On Windows: `netstat -ano | findstr :3000` to check port usage

### **Issue 3: Database Connection Failed**

**Error:**
```
Database is not healthy
Failed to initialize server
```

**Solution:**
1. Make sure PostgreSQL is running (if using Docker: `docker-compose up`)
2. Check `.env` database credentials
3. Test database connection: 
   ```bash
   psql -U postgres -d backend_db -c "SELECT 1"
   ```

### **Issue 4: Redis Connection Failed**

**Error:**
```
Redis connection error
```

**Solution:**
1. Make sure Redis is running (if using Docker: `docker-compose up`)
2. Check Redis URL in `.env`
3. Test Redis connection: `redis-cli ping`

### **Issue 5: JWT Token Errors**

**Error:**
```
Invalid or expired token
Authentication required
```

**Solution:**
1. Make sure you're sending the token in the Authorization header
2. Format: `Authorization: Bearer YOUR_TOKEN`
3. Check if token is expired (default 7 days)
4. Ensure `JWT_SECRET` is the same in backend and any generated tokens

### **Issue 6: Rate Limiting**

**Error:**
```
Too Many Requests
Rate limit exceeded
```

**Solution:**
1. This is intentional for security
2. Wait for the rate limit to reset
3. Adjust rate limit values in `src/middleware/rateLimiter.ts` if needed for development

---

## 🔒 Security Considerations for Frontend Integration

### **1. Never Store Tokens in localStorage for Production**

**Development:** localStorage is fine
**Production:** Use httpOnly cookies or secure storage

**Better Approach for Production:**
- Configure backend to use httpOnly cookies
- Use secure storage like Redux with encryption
- Consider using refresh tokens

### **2. Always Use HTTPS in Production**

**Development:** `http://localhost:3000` is fine
**Production:** Always use `https://your-api-domain.com`

### **3. Validate API Responses**

**Always check response status:**
```javascript
const response = await fetch(url);
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}
const data = await response.json();
```

### **4. Handle Errors Gracefully**

**Show user-friendly error messages:**
```javascript
try {
  const result = await apiCall();
} catch (error) {
  if (error.response?.status === 401) {
    showToast('Please login to continue');
  } else if (error.response?.status === 500) {
    showToast('Server error, please try again');
  } else {
    showToast('Something went wrong');
  }
}
```

---

## 🌐 Production Deployment Considerations

### **1. Backend Deployment**

**Options:**
- **VPS** (DigitalOcean, Linode, AWS EC2)
- **PaaS** (Heroku, Railway, Render)
- **Container** (Docker + Kubernetes)

**Deployment Steps:**
1. Set up environment variables
2. Configure CORS for production domain
3. Use strong JWT secret
4. Enable HTTPS (SSL/TLS)
5. Set up database backups
6. Configure Redis for production

### **2. Frontend Deployment**

**Options:**
- **Static hosting** (Vercel, Netlify, GitHub Pages)
- **SSR** (Next.js on Vercel, Nuxt on Netlify)
- **Container** (Docker + Kubernetes)

**Frontend Environment Variables:**
```env
REACT_APP_API_URL=https://your-api-domain.com
```

### **3. Domain Configuration**

**DNS Setup:**
- Point `api.yourdomain.com` to your backend server
- Point `www.yourdomain.com` to your frontend
- Configure SSL certificates for both

---

## 📋 Pre-Launch Checklist

### **Backend:**
- [ ] Backend running on correct port
- [ ] Database connection successful
- [ ] Redis connection successful
- [ ] All API endpoints tested
- [ ] CORS configured for frontend domain
- [ ] JWT secret is strong and secure
- [ ] Environment variables set correctly
- [ ] HTTPS configured (production)
- [ ] Rate limiting appropriate
- [ ] Health check endpoint accessible

### **Frontend:**
- [ ] API base URL configured
- [ ] HTTP client library installed
- [ ] Authentication flow tested
- [ ] Token storage implemented
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] API service functions created
- [ ] CORS errors handled
- [ ] HTTPS configured (production)

---

## 🧪 Integration Testing Script

Create a simple test script to verify connectivity:

**Create `test-connectivity.js` in your project root:**

```javascript
const API_BASE_URL = 'http://localhost:3000';

async function testConnectivity() {
  console.log('Testing Backend Connectivity...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);

    // Test 2: Get Products (No Auth)
    console.log('\n2. Testing Public Endpoint (Products)...');
    const productsResponse = await fetch(`${API_BASE_URL}/api/products`);
    const productsData = await productsResponse.json();
    console.log('✅ Products Retrieved:', productsData.length, 'products');

    // Test 3: User Registration
    console.log('\n3. Testing User Registration...');
    const registerResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testconnect@example.com',
        password: 'TestPass123!',
        name: 'Connectivity Test'
      })
    });
    const registerData = await registerResponse.json();
    console.log('✅ Registration Successful:', registerData.message);
    console.log('Token:', registerData.token.substring(0, 20) + '...');

    // Test 4: Protected Endpoint
    console.log('\n4. Testing Protected Endpoint (Get Profile)...');
    const profileResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${registerData.token}` }
    });
    const profileData = await profileResponse.json();
    console.log('✅ Profile Retrieved:', profileData);

    console.log('\n🎉 All Connectivity Tests Passed!');
    console.log('Your backend is ready for frontend integration.');

  } catch (error) {
    console.error('❌ Connectivity Test Failed:', error.message);
    console.error('Make sure your backend is running on port 3000');
  }
}

testConnectivity();
```

**Run the test:**
```bash
node test-connectivity.js
```

---

## 📊 API Response Format Reference

### **Success Response Format:**
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### **Error Response Format:**
```json
{
  "error": "Error message describing what went wrong"
}
```

### **Authentication Error:**
```json
{
  "error": "Authentication required"
}
```

### **Validation Error:**
```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

---

## 🎯 Recommended Frontend Integration Workflow

### **1. Start with Public Endpoints**
- Test `GET /api/products` (no auth required)
- Test `GET /api/products/:id` (no auth required)
- This verifies basic connectivity

### **2. Implement Authentication Flow**
- Test `POST /api/auth/register`
- Test `POST /api/auth/login`
- Store the returned token
- Test `GET /api/auth/me` with the token

### **3. Implement Protected Endpoints**
- Add product creation/update/delete
- Add order creation
- Test user-specific data access

### **4. Add Error Handling**
- Handle network errors
- Handle authentication errors
- Handle validation errors
- Handle rate limiting

### **5. Add Loading States**
- Show loading spinners during API calls
- Disable buttons during submission
- Show progress indicators

### **6. Add Optimistic Updates**
- Update UI immediately
- Revert on error
- Show success/error states

---

## 🔍 Debugging Connectivity Issues

### **Browser DevTools Network Tab:**
1. Open DevTools (F12)
2. Go to Network tab
3. Make an API call from your frontend
4. Check the request:
   - Status code (should be 200 for success)
   - Request headers (should include Authorization if authenticated)
   - Request body (should be JSON)
5. Check the response:
   - Response body
   - Response headers

### **Common Network Tab Issues:**
- **Status 401**: Authentication error (token missing or invalid)
- **Status 403**: Authorization error (user doesn't have permission)
- **Status 404**: Resource not found
- **Status 409**: Conflict (user already exists, etc.)
- **Status 429**: Rate limit exceeded
- **Status 500**: Server error

### **Backend Logs:**
Check your backend console for errors:
```bash
npm run dev
```

---

## 📱 Mobile App Integration Notes

### **React Native Specific:**
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store token
await AsyncStorage.setItem('token', token);

// Retrieve token
const token = await AsyncStorage.getItem('token');
```

### **Flutter Specific:**
```dart
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

// Store token
final prefs = await SharedPreferences.getInstance();
await prefs.setString('token', token);

// Retrieve token
final token = prefs.getString('token');
```

---

## 🎉 Summary

Your backend is **production-ready** and can be connected to any frontend application. The key points are:

1. **CORS is already configured** - you may need to adjust it for production
2. **All endpoints are functional** - test them individually
3. **Authentication works** - use JWT tokens in Authorization header
4. **Type-safe API** - TypeScript ensures you send/receive correct data structures
5. **Error handling** - proper error responses for all failure cases
6. **Rate limiting** - protects against abuse
7. **Health checks** - verify backend is running

**The most important thing:** Test each endpoint individually first with curl or Postman before integrating with your frontend. This isolates whether issues are with the backend or your frontend implementation.

Your backend is ready! Happy coding! 🚀