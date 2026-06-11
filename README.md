# 🏠 RentNest Platform

A full-stack MERN rental property platform with AI-powered features, Cloudinary image uploads, and JWT authentication.

## Tech Stack

| Layer        | Technology                                   |
|-------------|----------------------------------------------|
| Frontend     | React 18, Vite, React Router v7             |
| Backend      | Node.js, Express 4                           |
| Database     | MongoDB (Mongoose ODM)                       |
| Auth         | JWT (httpOnly cookies + Bearer tokens)       |
| File Uploads | Cloudinary + Multer                          |
| AI           | OpenRouter / OpenAI API (configurable)       |
| Styling      | Vanilla CSS (design system with variables)   |

## Project Structure

```
RentNest/
├── client/                      # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/              # Static assets (images, fonts)
│   │   ├── components/
│   │   │   ├── auth/            # ProtectedRoute, LoginForm
│   │   │   ├── common/          # Loader, SearchBar, Modal
│   │   │   ├── layout/          # Layout, Navbar, Footer
│   │   │   └── properties/      # PropertyCard, PropertyGrid
│   │   ├── constants/           # App-wide constants & configs
│   │   ├── context/             # React Context (AuthContext)
│   │   ├── hooks/               # Custom hooks (useProperties, useDebounce)
│   │   ├── pages/               # Route-level page components
│   │   ├── services/            # Axios API service layers
│   │   ├── styles/              # Global CSS & design tokens
│   │   ├── utils/               # Helper functions
│   │   ├── App.jsx              # Route definitions
│   │   └── main.jsx             # App entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Express Backend
│   ├── config/
│   │   ├── db.js                # MongoDB connection
│   │   ├── cloudinary.js        # Cloudinary SDK setup
│   │   └── seeder.js            # Database seeder script
│   ├── controllers/             # Route handler logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── propertyController.js
│   │   ├── bookingController.js
│   │   ├── reviewController.js
│   │   ├── aiController.js
│   │   └── uploadController.js
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verify + RBAC
│   │   ├── errorMiddleware.js   # Global error handler
│   │   ├── uploadMiddleware.js  # Multer + Cloudinary storage
│   │   └── validateMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Booking.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── aiRoutes.js
│   │   └── uploadRoutes.js
│   ├── services/
│   │   └── aiService.js         # AI API abstraction layer
│   ├── utils/
│   │   ├── helpers.js           # Token response, pagination
│   │   └── constants.js         # Enum definitions
│   ├── validators/
│   │   └── index.js             # express-validator rules
│   ├── uploads/                 # Local upload fallback
│   ├── package.json
│   └── server.js                # Express entry point
│
├── .env.example                 # Environment variable template
├── .gitignore
├── package.json                 # Root — concurrently scripts
└── README.md
```

## Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd AI-Rental
npm run install-all
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, Cloudinary, and AI keys
```

### 3. Run Development

```bash
npm run dev
```

This runs both frontend (`:5173`) and backend (`:5000`) concurrently.

## API Endpoints

| Method | Endpoint                          | Access          |
|--------|-----------------------------------|-----------------|
| POST   | `/api/v1/auth/register`           | Public          |
| POST   | `/api/v1/auth/login`              | Public          |
| GET    | `/api/v1/auth/me`                 | Private         |
| GET    | `/api/v1/properties`              | Public          |
| POST   | `/api/v1/properties`              | Landlord        |
| POST   | `/api/v1/bookings`                | Tenant          |
| POST   | `/api/v1/ai/generate-description` | Landlord        |
| POST   | `/api/v1/ai/chat`                 | Private         |
| POST   | `/api/v1/upload/property-images`  | Landlord        |

## Roles

- **Tenant** — Browse, book, review properties, AI chat
- **Landlord** — List properties, manage bookings, AI descriptions
- **Admin** — Full access to all resources

## License

MIT
