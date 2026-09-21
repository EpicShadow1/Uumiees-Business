# Backend API Architecture Design

## 🎯 Project Type: REST API Backend Service

**This is a backend API service** that provides REST endpoints for client applications (web, mobile, or other services) to consume. It is NOT a complete web application or mobile app - it's the server-side API that powers them.

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Web App    │  │  Mobile App  │  │  3rd Party   │          │
│  │  (React/Vue) │  │ (iOS/Android)│  │   Services   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼─────────────────┼─────────────────┼──────────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │ HTTP/HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NGINX REVERSE PROXY                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  • SSL Termination  • Load Balancing  • Rate Limiting   │   │
│  │  • Static Files     • Request Routing  • Caching        │   │
│  └───────────────────────────┬──────────────────────────────┘   │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS API SERVER                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MIDDLEWARE LAYER                                         │   │
│  │  • Security (Helmet, CORS)                               │   │
│  │  • Rate Limiting                                         │   │
│  │  • Authentication (JWT)                                  │   │
│  │  • Request Logging                                       │   │
│  │  • Input Validation                                      │   │
│  │  • Error Handling                                        │   │
│  └───────────────────────────┬──────────────────────────────┘   │
│                              │                                  │
│  ┌───────────────────────────┴──────────────────────────────┐   │
│  │  ROUTE LAYER                                              │   │
│  │  /api/auth/*     → Authentication endpoints             │   │
│  │  /api/users/*    → User management                       │   │
│  │  /api/products/* → Product catalog                        │   │
│  │  /api/orders/*   → Order processing                       │   │
│  │  /health         → Health checks                         │   │
│  │  /metrics        → Prometheus metrics                     │   │
│  └───────────────────────────┬──────────────────────────────┘   │
│                              │                                  │
│  ┌───────────────────────────┴──────────────────────────────┐   │
│  │  CONTROLLER LAYER (Request Handlers)                      │   │
│  │  • Parse requests                                         │   │
│  │  • Call services                                          │   │
│  │  • Return responses                                       │   │
│  └───────────────────────────┬──────────────────────────────┘   │
│                              │                                  │
│  ┌───────────────────────────┴──────────────────────────────┐   │
│  │  SERVICE LAYER (Business Logic)                           │   │
│  │  • UserService      → User operations                     │   │
│  │  • ProductService   → Product operations                  │   │
│  │  • OrderService     → Order processing                    │   │
│  │  • AuthService      → Authentication logic                │   │
│  └───────────────────────────┬──────────────────────────────┘   │
└──────────────────────────────┼──────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  POSTGRESQL   │    │     REDIS     │    │   BULL QUEUE  │
│   DATABASE    │    │     CACHE     │    │  (BACKGROUND  │
│               │    │               │    │    JOBS)      │
│ • Users       │    │ • Caching     │    │ • Email jobs  │
│ • Products    │    │ • Sessions    │    │ • Order jobs  │
│ • Orders      │    │ • Locks       │    │ • Processing  │
│ • Order Items │    │ • Rate limits │    │               │
└───────────────┘    └───────────────┘    └───────────────┘
```

---

## 🔧 Component Details

### **1. Client Layer**
- **Web Applications**: React, Vue, Angular, vanilla JS
- **Mobile Applications**: React Native, Flutter, native iOS/Android
- **Third-party Services**: Other APIs, microservices, integrations
- **Communication**: HTTP/HTTPS via REST API

### **2. Nginx Reverse Proxy**
- **Purpose**: Entry point for all incoming requests
- **Responsibilities**:
  - SSL/TLS termination
  - Load balancing across multiple API instances
  - Rate limiting and DDoS protection
  - Static file serving
  - Request routing and caching
  - Security headers

### **3. Express.js API Server**
- **Purpose**: Main application server
- **Architecture**: Layered architecture for separation of concerns

#### **Middleware Layer**
- **Security**: Helmet.js for security headers, CORS configuration
- **Rate Limiting**: Prevent abuse and DDoS attacks (express-rate-limit)
- **Authentication**: JWT token verification (authenticate middleware)
- **Session Management**: Redis-based session handling (sessionMiddleware)
- **Caching**: Redis response caching (cacheMiddleware)
- **Logging**: Request/response logging with Winston
- **Validation**: Input validation with express-validator (registerValidation, loginValidation, productValidation, orderValidation)
- **Error Handling**: Centralized error handling
- **Idempotency**: Prevent duplicate operations (idempotencyMiddleware)
- **Timeout**: Request timeout management (timeoutMiddleware)

#### **Route Layer**
- Define API endpoints and HTTP methods
- Route requests to appropriate controllers
- Apply middleware to route groups
- **Route Files**:
  - `src/routes/auth.ts` - Authentication endpoints
  - `src/routes/products.ts` - Product endpoints
  - `src/routes/orders.ts` - Order endpoints
  - `src/routes/users.ts` - User management endpoints
- **Endpoints**:
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User login
  - `GET /api/auth/me` - Get current user
  - `PUT /api/auth/me` - Update profile
  - `GET /api/products` - List products
  - `GET /api/products/:id` - Get product by ID
  - `POST /api/products` - Create product (auth required)
  - `PUT /api/products/:id` - Update product (auth required)
  - `DELETE /api/products/:id` - Delete product (auth required)
  - `POST /api/products/:id/stock` - Update stock (auth required)
  - `GET /api/products/:id/stock` - Check stock availability
  - `POST /api/orders` - Create order (auth required)
  - `GET /api/orders/my` - Get user's orders (auth required)
  - `GET /api/orders/:id` - Get order by ID (auth required)
  - `GET /api/orders` - Get all orders (auth required)
  - `PUT /api/orders/:id/status` - Update order status (auth required)
  - `POST /api/orders/:id/cancel` - Cancel order (auth required)
  - `GET /api/users` - Get all users
  - `GET /api/users/:id` - Get user by ID
  - `DELETE /api/users/:id` - Delete user (auth required)
  - `GET /health` - Health check
  - `GET /metrics` - Prometheus metrics

#### **Controller Layer**
- Handle HTTP requests and responses
- Parse request data with type-safe helper functions
- Call appropriate service methods
- Format responses with proper error handling
- **Controllers Implemented**:
  - `userController` - User registration, login, profile management
  - `productController` - Product CRUD, stock management
  - `orderController` - Order creation, status updates, cancellation

#### **Service Layer**
- **Business logic implementation**
- **Orchestrate data operations**
- **Apply resilience patterns**:
  - Circuit breakers for external calls
  - Retries with exponential backoff (executeWithRetry wrapper)
  - Distributed locking for critical operations (withLock)
  - Caching strategies
- **Transaction management** (PostgreSQL transactions for order creation)
- **Services Implemented**:
  - `userService` - User CRUD, password verification, authentication
  - `productService` - Product CRUD, inventory management with distributed locks
  - `orderService` - Order processing with transactions, inventory updates

### **4. Data Layer**

#### **PostgreSQL Database**
- **Purpose**: Primary data storage
- **Connection Pooling**: Reuse database connections
- **Tables**:
  - `users` - User accounts and authentication (id, email, password_hash, name, timestamps)
  - `products` - Product catalog (id, name, description, price, stock, timestamps)
  - `orders` - Order headers (id, user_id, total, status, timestamps)
  - `order_items` - Order line items (id, order_id, product_id, quantity, price, timestamps)
- **Features**:
  - ACID transactions
  - Indexes for performance (email, user_id, status, foreign keys)
  - Foreign key constraints with cascade actions
  - Connection pooling for scalability
  - Automatic timestamp triggers (updated_at)
- **Schema File**: `src/config/schema.sql` with auto-initialization

#### **Redis Cache**
- **Purpose**: High-performance caching and coordination
- **Use Cases**:
  - API response caching
  - Session storage
  - Rate limiting counters
  - Distributed locks
  - Job queue backend
- **Benefits**:
  - Sub-millisecond response times
  - Shared state across instances
  - Automatic expiration

#### **Bull Queue (Background Jobs)**
- **Purpose**: Asynchronous task processing
- **Job Types**:
  - Email sending
  - Order processing
  - Data exports
  - Payment processing
- **Features**:
  - Retry logic with exponential backoff
  - Job priorities
  - Concurrent processing
  - Dead letter queue for failed jobs

---

## 🔄 Request Flow Example

### **User Registration Flow**
```
1. Client → POST /api/auth/register
   ↓
2. Nginx → Routes to Express server
   ↓
3. Express Middleware:
   - Rate limiting check
   - Request parsing
   - Input validation
   ↓
4. Auth Controller:
   - Receives validated data
   - Calls AuthService.register()
   ↓
5. AuthService:
   - Checks if user exists (PostgreSQL)
   - Hashes password (bcrypt)
   - Creates user record (PostgreSQL)
   - Generates JWT token
   - Creates session (Redis)
   ↓
6. Response → Client receives token and user data
```

### **Product Listing with Caching**
```
1. Client → GET /api/products
   ↓
2. Cache Middleware:
   - Checks Redis for cached response
   - If cache hit → Return cached data
   - If cache miss → Continue to controller
   ↓
3. Product Controller:
   - Calls ProductService.getProducts()
   ↓
4. ProductService:
   - Queries PostgreSQL for products
   - Applies business logic (filtering, sorting)
   ↓
5. Cache Middleware:
   - Stores response in Redis (1 hour TTL)
   ↓
6. Response → Client receives product data
```

### **Order Creation with Distributed Lock**
```
1. Client → POST /api/orders (authenticated)
   ↓
2. Auth Middleware:
   - Verifies JWT token
   - Attaches user info to request
   ↓
3. Order Controller:
   - Calls OrderService.createOrder()
   ↓
4. OrderService:
   - Acquires distributed lock (Redis)
   - Checks product availability (PostgreSQL)
   - Updates inventory (PostgreSQL)
   - Creates order record (PostgreSQL)
   - Releases distributed lock
   - Queues background job (Bull)
   ↓
5. Background Job:
   - Sends confirmation email
   - Processes payment
   - Updates order status
   ↓
6. Response → Client receives order confirmation
```

---

## 🛡️ Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
├─────────────────────────────────────────────────────────────┤
│ 1. Network Security                                          │
│    • SSL/TLS encryption (HTTPS)                             │
│    • Firewall rules                                          │
│    • DDoS protection (Nginx rate limiting)                   │
├─────────────────────────────────────────────────────────────┤
│ 2. Application Security                                      │
│    • Security headers (Helmet.js)                            │
│    • CORS configuration                                      │
│    • Input validation                                        │
│    • SQL injection prevention (parameterized queries)        │
│    • XSS protection                                          │
├─────────────────────────────────────────────────────────────┤
│ 3. Authentication & Authorization                            │
│    • JWT token-based authentication                          │
│    • Password hashing (bcrypt)                               │
│    • Role-based access control                               │
│    • Session management (Redis)                             │
├─────────────────────────────────────────────────────────────┤
│ 4. Data Security                                             │
│    • Encrypted passwords                                     │
│    • Environment variables for secrets                       │
│    • Database connection encryption                          │
│    • Redis authentication                                    │
├─────────────────────────────────────────────────────────────┤
│ 5. API Security                                              │
│    • Rate limiting                                            │
│    • Request size limits                                     │
│    • Timeout configurations                                  │
│    • Idempotency keys for safe retries                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────┐
│              OBSERVABILITY ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────┤
│ Logs (Winston)                                              │
│ • Request logs                                               │
│ • Error logs                                                 │
│ • Application logs                                           │
│ • Structured JSON format                                     │
├─────────────────────────────────────────────────────────────┤
│ Metrics (Prometheus)                                         │
│ • HTTP request duration                                      │
│ • Request counts                                             │
│ • Database query duration                                    │
│ • Active connections                                        │
│ • Memory/CPU usage                                           │
├─────────────────────────────────────────────────────────────┤
│ Health Checks                                                │
│ • /health - Overall health                                   │
│ • /readiness - Dependency checks                             │
│ • /liveness - Process alive check                           │
├─────────────────────────────────────────────────────────────┤
│ Tracing (Optional)                                           │
│ • Distributed tracing for request flows                      │
│ • Performance bottleneck identification                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Architecture

### **Development Environment**
```
Developer Machine
├── Node.js/Express (running locally)
├── PostgreSQL (Docker container)
├── Redis (Docker container)
└── File-based logging
```

### **Production Environment**
```
┌─────────────────────────────────────────────────────────────┐
│                    LOAD BALANCER                              │
│                  (Cloud Provider LB)                         │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   API NODE 1 │   │   API NODE 2 │   │   API NODE 3 │
│  (Express)   │   │  (Express)   │   │  (Express)   │
└──────┬───────┘   └──────┬───────┘   └──────┬───────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ PostgreSQL   │   │    Redis     │   │  Bull Queue  │
│ (Primary)    │   │   (Cache)    │   │   (Jobs)     │
│              │   │              │   │              │
│ [Read Replica]│   │              │   │              │
└──────────────┘   └──────────────┘   └──────────────┘
```

### **Kubernetes Deployment**
```
Kubernetes Cluster
├── Ingress Controller (Nginx)
├── Backend Deployment (3 replicas)
│   └── Backend Pods (Express.js)
├── PostgreSQL StatefulSet
├── Redis Deployment
├── Bull Queue Workers
└── Monitoring Stack (Prometheus, Grafana)
```

---

## 🎯 Key Architectural Patterns Used

### **1. Layered Architecture**
- Clear separation of concerns
- Routes → Controllers → Services → Data
- Easy to test and maintain
- **Actual Structure**:
  - `src/routes/` - Route definitions
  - `src/controllers/` - Request handlers
  - `src/services/` - Business logic
  - `src/models/` - Data interfaces
  - `src/middleware/` - Express middleware
  - `src/config/` - Configuration files
  - `src/utils/` - Utility functions

### **2. Statelessness**
- API servers don't store session state
- Session data in Redis
- Enables horizontal scaling

### **3. Circuit Breaker Pattern**
- Prevents cascading failures
- Fails fast when dependencies are down
- Automatic recovery

### **4. Retry with Exponential Backoff**
- Handles transient failures
- Reduces load on failing systems
- Improves resilience

### **5. Distributed Locking**
- Coordinates access across instances
- Prevents race conditions
- Ensures data consistency

### **6. Caching Strategy**
- Reduces database load
- Improves response times
- Cache-aside pattern

### **7. Background Job Processing**
- Asynchronous task execution
- Better user experience
- Retry logic for failed jobs

### **8. Graceful Shutdown**
- No dropped connections
- Clean resource cleanup
- Zero-downtime deployments

---

## � Complete File Structure

```
Backend_Project/
├── src/
│   ├── config/
│   │   ├── auth.ts              # JWT generation/verification, password hashing
│   │   ├── database.ts          # PostgreSQL connection pool, retry logic
│   │   ├── databaseInit.ts      # Database schema initialization
│   │   ├── schema.sql           # Database schema with triggers
│   │   ├── logger.ts            # Winston logging configuration
│   │   ├── metrics.ts           # Prometheus metrics setup
│   │   ├── proxy.ts             # Nginx proxy configuration
│   │   ├── queue.ts             # Bull queue setup
│   │   ├── redis.ts             # Redis client with retry logic
│   │   └── timeout.ts           # Timeout configurations
│   ├── controllers/
│   │   ├── userController.ts    # User authentication and management
│   │   ├── productController.ts # Product CRUD and inventory
│   │   ├── orderController.ts   # Order processing
│   │   └── index.ts             # Controller exports
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication middleware
│   │   ├── cache.ts             # Redis caching middleware
│   │   ├── idempotency.ts       # Idempotency middleware
│   │   ├── rateLimiter.ts       # Rate limiting middleware
│   │   ├── session.ts           # Session management middleware
│   │   └── validator.ts         # Input validation middleware
│   ├── models/
│   │   ├── User.ts              # User data interfaces
│   │   ├── Product.ts           # Product data interfaces
│   │   ├── Order.ts             # Order data interfaces
│   │   └── index.ts             # Model exports
│   ├── routes/
│   │   ├── auth.ts              # Authentication routes
│   │   ├── products.ts          # Product routes
│   │   ├── orders.ts            # Order routes
│   │   ├── users.ts             # User management routes
│   │   └── index.ts             # Route exports
│   ├── services/
│   │   ├── userService.ts       # User business logic
│   │   ├── productService.ts    # Product business logic
│   │   ├── orderService.ts      # Order business logic
│   │   └── index.ts             # Service exports
│   ├── types/
│   │   └── express.d.ts         # Express type extensions
│   ├── utils/
│   │   ├── circuitBreaker.ts    # Circuit breaker implementation
│   │   ├── distributedLock.ts  # Distributed lock implementation
│   │   ├── helpers.ts           # Type-safe helper functions
│   │   └── retry.ts             # Retry with exponential backoff
│   ├── jobs/
│   │   └── emailJob.ts          # Email job processor
│   └── index.ts                 # Application entry point
├── .env                         # Environment variables
├── .env.production             # Production environment variables
├── .dockerignore               # Docker ignore file
├── Dockerfile                  # Multi-stage Docker configuration
├── docker-compose.yml          # Docker Compose configuration
├── nginx.conf                  # Nginx configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── ARCHITECTURE.md             # Architecture documentation
└── STEP_BY_STEP_GUIDE.md       # Learning guide
```

---

## 🔧 Implementation Details

### **Type Safety**
- **Express Type Extensions**: Custom Request types in `src/types/express.d.ts`
- **Helper Functions**: Type-safe parameter extraction in `src/utils/helpers.ts`
- **Model Interfaces**: Strict typing for all data structures
- **Zero TypeScript Errors**: All code compiles without type errors

### **Database Schema**
```sql
-- Users table with email uniqueness and password hashing
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table with inventory tracking
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table with user relationship
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items with product relationship
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance indexes
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_order_items_order_id ON order_items (order_id);
CREATE INDEX idx_order_items_product_id ON order_items (product_id);

-- Automatic timestamp triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **Security Implementation**
- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: 7-day expiration with secret key
- **Rate Limiting**: Different limits for auth (5/min) vs API (100/min)
- **Input Validation**: express-validator for all endpoints
- **CORS**: Configured for frontend access
- **Security Headers**: Helmet.js for XSS, frameguard, HSTS

### **Resilience Patterns**
- **Database Retry**: executeWithRetry wrapper with exponential backoff
- **Distributed Locking**: Redis-based locks for inventory updates
- **Circuit Breaker**: Implemented for external service calls
- **Graceful Shutdown**: Proper resource cleanup on SIGTERM/SIGINT
- **Connection Pooling**: PostgreSQL connection pool for performance

---

## �📝 Summary

This is a **REST API backend service** designed to:

- **Serve multiple client types** (web, mobile, third-party)
- **Handle high traffic** through load balancing and caching
- **Maintain high availability** through resilience patterns
- **Provide security** at multiple layers
- **Enable monitoring** through comprehensive observability
- **Scale horizontally** through stateless design
- **Process tasks asynchronously** through job queues

The architecture follows industry best practices and can be deployed to any cloud provider or on-premises infrastructure.