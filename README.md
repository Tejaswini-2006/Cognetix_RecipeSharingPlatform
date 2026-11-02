# RecipeHub — Full-Stack Recipe Sharing Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v22+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18+-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v6+-646CFF.svg)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v8.0+-47A248.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-v4.21+-lightgrey.svg)](https://expressjs.com/)

> **Cognetix Technology Full Stack Developer Internship — Task 5**  
> **Author & Developer:** Tejaswini ([@Tejaswini-2006](https://github.com/Tejaswini-2006))  
> **Repository:** [https://github.com/Tejaswini-2006/Cognetix_RecipeSharingPlatform](https://github.com/Tejaswini-2006/Cognetix_RecipeSharingPlatform)

---

## 📖 1. Project Overview

**RecipeHub** is a modern, responsive, and feature-complete full-stack recipe discovery and community sharing web application. Designed with a warm culinary aesthetic (creams, warm terracotta, and deep forest greens), RecipeHub enables cooking enthusiasts, foodies, and home chefs to explore, create, manage, and share recipes from around the globe.

The application is built on the **MERN** stack (MongoDB, Express.js, React, Node.js) with Vite, offering real-time image uploads via Multer, secure JWT authentication with bcrypt password hashing, dynamic interactive cooking checklists, responsive design for all viewports, and comprehensive RESTful APIs.

---

## ✨ 2. Key Features

### 🍳 Recipe Discovery & Exploration
- **Hero Showcase**: Captivating culinary introduction with instant keyword search and community metrics.
- **Recipe Catalog**: Filter recipes by category (Indian, Italian, Chinese, Desserts, Breakfast, Fast Food, Healthy Food, Beverages), ingredient query, or sort order (Newest, Oldest, Quickest Prep, Alphabetical).
- **Interactive Recipe Details**:
  - High-resolution hero image display.
  - Quick cooking metrics (Prep time, Cook time, Total duration, Servings).
  - Interactive ingredients checklist with live strikethrough functionality as users cook.
  - Sequentially numbered cooking instructions.
  - Related recipe recommendations within the same category.
  - Instant URL link sharing.

### 🔐 Authentication & Authorization
- **JWT-Based Authentication**: Secure token generation, storage, and validation.
- **Password Security**: Strong hashing with `bcryptjs` (salt rounds: 10). Never stores plain-text credentials.
- **Client & Server Validation**: Input sanitation, duplicate email prevention, and password length checks.
- **Protected Routes**: Only authenticated users can access the Recipe Publishing and Personal Dashboard views.
- **Strict Authorization**: Recipe creators retain exclusive ownership. Unauthorized edit or delete attempts are blocked with HTTP `403 Forbidden`.
- **Demo Chef Login**: 1-click test button pre-populates sample credentials for instant reviewer walkthrough.

### 📝 Recipe Management (CRUD)
- **Create**: Add new recipes with title, category, description, prep/cook timings, servings, dynamic ingredients list, step-by-step instructions, and photo upload.
- **Read**: Browse all recipes with server-side pagination, search by title/description, filter by category, or view specific recipe details.
- **Update**: Edit existing recipe content, adjust quantities/instructions, and optionally replace food photography with instant preview.
- **Delete**: Remove personal recipes with a two-step confirmation modal and automatic server-side image cleanup.
- **My Recipes**: Dedicated dashboard displaying all recipes authored by the logged-in user with quick edit/delete actions.

### 📷 Multer Image Upload System
- **Supported Formats**: JPG, JPEG, PNG, and WEBP images.
- **File Limits**: Enforces a 5MB size limit and file type filters.
- **Real-Time Client Preview**: Instant visual preview before form submission.
- **Storage**: Files stored securely in `backend/uploads/` with unique sanitized filenames.
- **Automatic File Cleanup**: Old local images are automatically deleted when recipes are updated or deleted, avoiding disk clutter.
- **Default Fallback**: Dynamic SVG placeholder image ensures missing images never break the UI.

---

## 🛠️ 3. Technology Stack

### Frontend
- **React.js 18** (SPA architecture)
- **Vite 6** (Blazing-fast build tool and dev server)
- **React Router DOM 6** (Declarative client routing and protected routes)
- **Context API** (Global persistent authentication state)
- **Axios** (Configured HTTP client with request/response interceptors)
- **Lucide React** (Clean, modern iconography)
- **Vanilla CSS3** (Custom responsive design system with CSS variables, typography, animations, and card layouts)

### Backend
- **Node.js** (v22+)
- **Express.js 4** (RESTful API microservice)
- **MongoDB & Mongoose 8** (NoSQL schema modeling and indexing)
- **JSON Web Tokens (JWT)** (Stateless session tokens with 30-day expiration)
- **bcryptjs** (Industry-standard password hashing)
- **Multer** (Multipart file upload handling and storage)
- **dotenv & cors** (Environment management and Cross-Origin Resource Sharing)
- **morgan** (HTTP request logger for development)

---

## 🎨 4. Design Direction & Palette

| Token | Hex Code | Visual Purpose |
| :--- | :--- | :--- |
| **Cream Base** | `#FAF7F2` | Warm, comfortable background |
| **Surface Card** | `#FFFDF9` | High-contrast elevated recipe cards |
| **Deep Forest Green** | `#1E3A2F` | Primary headers, brand accents, strong buttons |
| **Terracotta Orange** | `#E06B43` | Accent highlights, CTA buttons, interactive badges |
| **Sage Light** | `#EBF4F0` | Category pills and soft badge backgrounds |
| **Espresso Dark** | `#221F1B` | High-legibility body typography |

---

## 📁 5. Folder Structure

```text
Cognetix_RecipeSharingPlatform/
├── .gitignore
├── README.md
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, getMe
│   │   └── recipeController.js   # Full CRUD, search, filter, my-recipes
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT Bearer token protection
│   │   ├── errorMiddleware.js    # 404 & centralized error handlers
│   │   └── uploadMiddleware.js   # Multer storage, filters & safe cleanup
│   ├── models/
│   │   ├── Recipe.js             # Recipe schema & categories enum
│   │   └── User.js               # User schema & bcrypt password hooks
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   └── recipeRoutes.js       # /api/recipes routes
│   ├── uploads/
│   │   ├── .gitkeep
│   │   └── default-recipe.svg    # Default image fallback
│   ├── .env                      # Local environment configuration (gitignored)
│   ├── .env.example              # Template environment variables
│   ├── package.json              # Backend dependencies & scripts
│   ├── seed.js                   # Database seeder with 8 realistic recipes
│   ├── server.js                 # Express server entry point
│   └── test-suite.js             # Automated end-to-end testing suite
│
└── frontend/
    ├── public/
    │   └── favicon.svg           # RecipeHub chef hat favicon
    ├── src/
    │   ├── assets/               # Static icons and assets
    │   ├── components/
    │   │   ├── AlertMessage.jsx   # Success/Error/Info alert banner
    │   │   ├── DeleteModal.jsx    # Deletion confirmation modal
    │   │   ├── Footer.css & .jsx  # Responsive footer with project meta
    │   │   ├── LoadingSpinner.jsx # Utensil animation spinner
    │   │   ├── Navbar.css & .jsx  # Responsive navbar with mobile drawer
    │   │   ├── Pagination.jsx     # Numbered pagination controls
    │   │   ├── ProtectedRoute.jsx # Route authentication guard
    │   │   └── RecipeCard.css & .jsx # Recipe card with hover animations
    │   ├── context/
    │   │   └── AuthContext.jsx    # Auth state & token persistence
    │   ├── pages/
    │   │   ├── AddRecipePage.jsx  # Multi-step recipe creation with upload
    │   │   ├── Auth.css           # Authentication form layout styles
    │   │   ├── EditRecipePage.jsx # Recipe update view
    │   │   ├── HomePage.css & .jsx # Landing page with hero & categories
    │   │   ├── LoginPage.jsx      # Login view with Demo Chef shortcut
    │   │   ├── MyRecipesPage.css & .jsx # Personal recipe cookbook
    │   │   ├── NotFoundPage.jsx   # 404 culinary error page
    │   │   ├── RecipeDetailsPage.css & .jsx # Detail view with checklist
    │   │   ├── RecipeForm.css     # Form layouts for add/edit views
    │   │   └── RecipesPage.css & .jsx # Recipe catalog with search & filters
    │   ├── services/
    │   │   ├── api.js             # Axios instance & image URL helper
    │   │   ├── authService.js     # Auth API callers
    │   │   └── recipeService.js   # Recipe API callers
    │   ├── App.jsx                # Route definitions & app scaffolding
    │   ├── index.css              # Global themes, reset & typography
    │   └── main.jsx               # React entry point
    ├── index.html                 # HTML template with Google Fonts
    ├── package.json               # Frontend dependencies & scripts
    └── vite.config.js             # Vite configuration with proxy
```

---

## ⚙️ 6. Environment Variables

Create a `.env` file inside the `backend/` directory based on `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/recipehub
JWT_SECRET=supersecret_recipehub_jwt_key_2026_cognetix_internship
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> **Using MongoDB Atlas (Cloud)?**  
> Simply replace `MONGO_URI` with your connection string:  
> `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/recipehub?retryWrites=true&w=majority`

---

## 🚀 7. Installation & Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher installed)
- [MongoDB](https://www.mongodb.com/) (Local service or MongoDB Atlas connection)
- [Git](https://git-scm.com/)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Tejaswini-2006/Cognetix_RecipeSharingPlatform.git
cd Cognetix_RecipeSharingPlatform
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables
Inside `backend/`, copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Ensure your MongoDB server is running).*

### Step 4: Seed Sample Culinary Data (Optional but Recommended)
Populate the database with 4 demo chefs and 8 curated international recipes across all categories:
```bash
node seed.js
```

### Step 5: Install Frontend Dependencies
In a new terminal window:
```bash
cd frontend
npm install
```

---

## 🏃 8. Running the Application

### Start the Backend Server (Port 5000)
```bash
cd backend
npm start
# or for auto-reloading: npm run dev
```
*The server will start listening at `http://localhost:5000`.*

### Start the Frontend Client (Port 5173)
```bash
cd frontend
npm run dev
```
*Open your browser and navigate to `http://localhost:5173`.*

---

## 🧪 9. Testing the Application

### Automated End-to-End Test Suite
A comprehensive testing script is included in `backend/test-suite.js` covering 19 distinct tests across all user stories:
- System Health Check (`/api/health`)
- User Registration & Duplicate Email Rejection
- Valid & Invalid Credential Login
- Bearer Token Retrieval & Guard Validation (`/api/auth/me`)
- Multipart Image Upload via Multer (`POST /api/recipes`)
- Search by Keyword & Category Filtering
- Recipe Details Population (`GET /api/recipes/:id`)
- Unauthorized Edit & Delete Blocking (`403 Forbidden`)
- Authorized Recipe Modification (`PUT /api/recipes/:id`)
- Authorized Recipe Deletion (`DELETE /api/recipes/:id`)
- Subsequent 404 Lookup Verification

Run the test suite:
```bash
cd backend
node test-suite.js
```

### Manual Testing Credentials
To test the web interface directly in your browser:
- **Chef Email:** `tejaswini@recipehub.com`
- **Password:** `password123`
*(Or click the **"Login as Demo Chef"** shortcut on the Sign In page!)*

---

## 📡 10. Backend API Reference

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & retrieve JWT | No |
| `GET` | `/api/auth/me` | Fetch current user profile | Yes (Bearer) |

### Recipe Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/recipes` | List recipes (supports `search`, `category`, `page`, `sort`) | No |
| `GET` | `/api/recipes/:id` | Retrieve single recipe details by ID | No |
| `POST` | `/api/recipes` | Create new recipe with optional image upload | Yes (Bearer) |
| `PUT` | `/api/recipes/:id` | Update existing recipe (owner only) | Yes (Bearer) |
| `DELETE` | `/api/recipes/:id` | Delete existing recipe (owner only) | Yes (Bearer) |
| `GET` | `/api/recipes/search` | Search recipes by keyword (`?name=`) | No |
| `GET` | `/api/recipes/filter` | Filter recipes by category (`?category=`) | No |
| `GET` | `/api/recipes/my-recipes` | Get recipes authored by logged-in user | Yes (Bearer) |
| `GET` | `/api/recipes/categories`| Get list of supported categories | No |

### Health Check
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service uptime and status check | No |

---

## 📸 11. Screenshots Section

| Home Page Hero | Recipe Discovery & Filters |
| :---: | :---: |
| *Hero section with warm aesthetic, search bar, and culinary badges* | *Responsive recipe grid with category tabs and sort options* |

| Recipe Details & Interactive Checklist | Add Recipe Form & Photo Upload |
| :---: | :---: |
| *Interactive ingredients checklist and step-by-step instructions* | *Multer image drag-and-drop preview and dynamic list rows* |

---

## 👩‍💻 12. Author & Acknowledgments

- **Developer:** Tejaswini ([@Tejaswini-2006](https://github.com/Tejaswini-2006))
- **Program:** Cognetix Technology Full Stack Developer Internship
- **Task:** Task 5 — Full-Stack Recipe Sharing Platform
- **Repository URL:** [https://github.com/Tejaswini-2006/Cognetix_RecipeSharingPlatform](https://github.com/Tejaswini-2006/Cognetix_RecipeSharingPlatform)

---
*Built with ❤️ for food lovers and developers alike.*
