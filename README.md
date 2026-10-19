# Prompt User ID — Modern Auth Portal (Front-End)

A minimalist, high-performance **React + Vite** authentication portal featuring a glassmorphism frosted-glass interface, dynamic gradient background, client-side validation, password visibility toggles, and live API connectivity to the Prompt User ID backend.

---

## ✨ Features

- **Glassmorphism Frosted-Glass Card**: Polished `backdrop-filter: blur(28px)` card with translucent borders, subtle box shadows, and ambient animated glowing background orbs.
- **User ID / Email Authentication**: Flexible input supporting either user handles or registered email addresses.
- **Show / Hide Password Toggle**: Accessible eye icons allowing users to securely peek or hide their typed passwords on both login and signup forms.
- **Full Auth Lifecycle**:
  - **Log In**: Submits credentials to `POST /api/auth/login`.
  - **Sign Up**: Registers accounts via `POST /api/auth/signup` with interactive password strength scoring (Weak → Strong) and password confirmation match validation.
  - **Forgot Password**: Password reset recovery flow via `POST /api/auth/forgot-password`.
- **Real API Connectivity (No Hardcoded Fake Success)**:
  - Form submissions send real HTTP requests to `${VITE_API_BASE_URL}/api/auth/...`.
  - Displays real server responses, HTTP status badges (`200 OK`, `401 Unauthorized`, `409 Conflict`), and expandable raw response payload inspect tools.
  - Gracefully captures network errors and backend offline states with user-friendly actionable notices.
- **Dynamic API Config & Health Check**:
  - Bottom badge shows current target backend URL.
  - One-click ping button checks backend health status (Online / Offline / Checking).
  - Built-in popover allows on-the-fly URL modification directly in the browser for rapid testing against different environments without rebuilding.
- **Responsive Layout**: Pixel-perfect on mobile smartphones, tablets, laptops, and ultra-wide displays.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Styling**: Pure CSS3 (Custom Glassmorphism Design System, CSS Variables, Keyframe Animations)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Project Structure

```text
prompt-user-frontend/
├── dist/                      # Production build output
├── public/
│   └── favicon.svg            # Custom SVG portal icon
├── src/
│   ├── config/
│   │   └── api.js             # API base URL & endpoint helpers
│   ├── services/
│   │   └── authService.js     # Real HTTP fetch API methods (login, signup, health)
│   ├── components/
│   │   ├── LoginForm.jsx      # Login form with User ID/email & password
│   │   ├── SignupForm.jsx     # Registration form with strength meter & validation
│   │   ├── ForgotPasswordForm.jsx # Password recovery view
│   │   ├── PasswordField.jsx  # Reusable password input with show/hide toggle
│   │   ├── ResponseBanner.jsx # Live API feedback banner with raw JSON inspector
│   │   ├── ApiConfigBadge.jsx # Backend URL badge with health ping & switcher
│   │   └── UserDashboard.jsx  # Authenticated session view upon successful login
│   ├── App.jsx                # Main portal view and state coordinator
│   ├── index.css              # Glassmorphism design system & responsive styling
│   └── main.jsx               # Application entry point
├── .env                       # Local environment variables
├── .env.example               # Template for environment variables
├── index.html                 # HTML template with Plus Jakarta Sans font
├── package.json               # Scripts and dependencies
├── render.yaml                # Render Static Site blueprint
└── vite.config.js             # Vite configuration
```

---

## ⚙️ Environment Variables

The application relies on the `VITE_API_BASE_URL` environment variable to determine where backend authentication requests are dispatched.

| Variable Name | Description | Example (Local) | Example (Production) |
|---|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API (no trailing slash) | `http://localhost:5000` | `https://prompt-user-backend.onrender.com` |

Create a `.env` file in the `prompt-user-frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js** (v18, v20, or v22 LTS)
- **npm** (v9 or higher)

### 2. Installation

Navigate into the frontend directory and install dependencies:

```bash
cd prompt-user-frontend
npm install
```

### 3. Running Development Server

Start Vite in development mode:

```bash
npm run dev
```

Open your browser at:
`http://localhost:5173`

### 4. Building for Production

Compile and bundle the production assets into `dist/`:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🧪 Testing the Authentication Flow

You can test both success and failure cases against the companion backend located in `../prompt-user-backend`.

### Step 1: Start the Companion Backend

In a separate terminal:

```bash
cd ../prompt-user-backend
npm install
npm start
```
*(Runs on `http://localhost:5000`)*

### Step 2: Test Pre-Configured Seed Account

| Field | Value |
|---|---|
| **User ID or Email** | `demo_user` (or `demo@example.com`) |
| **Password** | `Password123!` |

1. Enter these credentials on the **Log In** tab.
2. Click **Sign In**.
3. The frontend sends `POST /api/auth/login`.
4. You will see a real **HTTP 200 OK** response and transition to the **User Dashboard** displaying the verified session, user handle, and active Bearer token.
5. Click **"View actual server response payload"** to inspect the live JSON returned by the server.

### Step 3: Test Real Error Handling

1. Try typing an incorrect password (e.g. `wrongpass`).
2. Click **Sign In**.
3. The server responds with `HTTP 401 Unauthorized` and `{ error: "Incorrect password..." }`.
4. The frontend displays the friendly error alert and status badge without crashing or using fake data.

### Step 4: Test Account Registration

1. Switch to the **Sign Up** tab.
2. Enter a unique User ID (e.g. `jane_doe`), email (`jane@example.com`), and a password.
3. Observe the password strength indicator change from **Weak** to **Strong** as you type uppercase letters, numbers, and symbols.
4. Click **Create Account**.
5. The frontend sends `POST /api/auth/signup`.
6. Upon `HTTP 201 Created`, a success banner confirms account creation and switches to the Login tab.

### Step 5: Test Network Offline Error

1. Stop the backend server (Ctrl+C in backend terminal).
2. Attempt to sign in on the frontend.
3. The frontend captures the connection drop and displays a clear message: `"Unable to connect to backend at http://localhost:5000/api/auth/login. Please ensure the backend server is running and CORS is enabled."`

---

## 🌐 Deploying to Render as a Static Site

This project is optimized for deployment as a **Render Static Site**.

### Method A: Deploy via Render Dashboard (Recommended)

1. Push your code to your GitHub / GitLab repository.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** and select **Static Site**.
4. Connect your repository.
5. Configure the deployment settings:
   - **Name**: `prompt-user-frontend` (or your preferred name)
   - **Branch**: `main`
   - **Root Directory**: `prompt-user-frontend` *(leave empty if the repo root is already the frontend folder)*
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
6. Under **Environment Variables**, add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://<your-backend-service>.onrender.com`
7. Under **Redirects / Rewrites**, add an SPA rewrite rule:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
8. Click **Create Static Site**.

### Method B: Deploy using `render.yaml` (Blueprint)

This repository includes a pre-configured `render.yaml` file:

```yaml
services:
  - type: web
    name: prompt-user-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_API_BASE_URL
        value: https://your-backend-api.onrender.com
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

In Render, simply go to **Blueprints** → **New Blueprint Instance** and select your repository to automatically configure the build and rewrite settings.

---

## 🔒 Security Best Practices

- All authentication requests use `POST` over HTTPS with JSON payloads.
- Passwords are never logged in plaintext to the console.
- Inputs are sanitized and trimmed to prevent whitespace errors.
- CORS is cleanly configured for trusted origins.
