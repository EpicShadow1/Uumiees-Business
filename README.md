# Uumiee's Business - Premium E-commerce Platform

A complete premium e-commerce platform with backend, web, and mobile applications in a single monorepo.

## 🏗️ Monorepo Structure

```
uumiees/
├── apps/
│   ├── backend/      # Node.js/Express backend API
│   ├── web/          # Next.js web application
│   └── mobile/       # Expo mobile application (Android & iOS)
├── packages/
│   ├── api/          # Shared API client
│   ├── types/        # Shared TypeScript types
│   ├── validation/   # Shared validation schemas (Zod) - to be added
│   ├── utils/        # Shared utilities - to be added
│   ├── config/       # Shared configuration - to be added
│   └── ui/           # Shared UI components (platform-specific) - to be added
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL (for backend)
- Redis (for backend)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and Redis credentials
```

### Development

```bash
# Start all apps (backend + web + mobile)
pnpm dev

# Start individual apps
pnpm backend    # Backend API only
pnpm web        # Web app only
pnpm mobile     # Mobile app only
```

### Build

```bash
# Build all apps
pnpm build

# Build individual apps
cd apps/backend && pnpm build
cd apps/web && pnpm build
```

## 📦 Applications

### Backend (@uumiees/backend)
Node.js/Express REST API with:
- JWT authentication
- PostgreSQL database
- Redis caching and sessions
- Product management with images and variants
- Shopping cart with guest support
- Order processing with real-time tracking
- Product reviews and ratings
- Wishlist management
- Discount and promotion system
- Customer support tickets
- Rate limiting and security middleware

**Run:** `pnpm backend` or `cd apps/backend && npm run dev`

### Web App (@uumiees/web)
Next.js 14 web application with:
- App Router
- TypeScript
- TanStack Query
- React Hook Form
- Zod validation
- Tailwind CSS
- Framer Motion
- Premium design system

**Run:** `pnpm web` or `cd apps/web && npm run dev`

### Mobile App (@uumiees/mobile)
Expo mobile application with:
- React Native
- Expo Router
- TypeScript
- TanStack Query
- React Hook Form
- Zod validation
- Android & iOS support

**Run:** `pnpm mobile` or `cd apps/mobile && npm start`

## 📦 Packages

### @uumiees/types
Shared TypeScript types used by backend, web, and mobile. Ensures type consistency across all applications.

### @uumiees/api
Shared API client using Axios with:
- Automatic authentication handling
- Request/response interceptors
- Type-safe API methods
- Error handling

## 🎨 Design System

### Colors
- **Primary (Royal Blue):** #173B8F
- **Secondary (Deep Navy):** #081A3A
- **Accent (Royal Gold):** #D4AF37
- **Background (Warm Ivory):** #FFFDF7
- **Surface (Soft Gray):** #F4F5F7
- **Text (Charcoal):** #171A21

### Typography
- **Sans:** Inter (body text)
- **Display:** Playfair Display (headings)

## � API Endpoints

The backend exposes the following endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `GET /api/products/search` - Search products
- `GET /api/products/featured` - Featured products

### Categories
- `GET /api/categories` - List categories
- `GET /api/categories/:id` - Get category
- `GET /api/categories/tree` - Category tree

### Cart
- `GET /api/cart` - Get shopping cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove item from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/cancel` - Cancel order

### Tracking
- `GET /api/tracking/order/:orderId` - Get order tracking
- `GET /api/tracking/order/:orderId/latest` - Latest tracking status

And many more for reviews, wishlist, discounts, and support.

## 🤖 AI Assistant

AI assistant integration is planned for future development. The backend is ready to support AI tool calling for:
- Product search and recommendations
- Order status queries
- Customer support assistance

## 📄 License

Private - Uumiee's Business
