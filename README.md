<div align="center">
  <h1>🎨 Frontend Documentation <br/> Interview Coach AI</h1>
  <p><i>AI-powered interview preparation and resume analysis system built with Next.js 14+, TypeScript, and Tailwind CSS.</i></p>
  
  <p>
    <img src="https://img.shields.io/badge/Framework-Next.js_14-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Language-TypeScript-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  </p>
</div>

---

## 🚀 Live API Connection

> **Production Backend API:** [`https://interviewcoach-ai-backend.onrender.com/`](https://interviewcoach-ai-backend.onrender.com/)

*Make sure your `.env.local` or `.env.production` files on Vercel point `NEXT_PUBLIC_API_URL` to this backend endpoint.*

---

## 🌟 Overview

Interview Coach AI helps job seekers prepare for interviews with:
- 📄 **Resume Analysis:** Analyze your resume against job descriptions for match scoring.
- 🎯 **Interview Questions:** Generate AI-powered interview questions tailored to your profile.
- 👤 **Profile Management:** Store and manage your professional profile and resume.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI/UX**: Dark theme with gradient accents, backdrop blur effects
- **State Management**: React Hooks (`useState`, `useEffect`)
- **Routing**: URL-based parameter passing and query strings

---

## 📂 Project Structure

```text
frontend/
├── app/
│   ├── auth/                          # Authentication pages
│   │   ├── otpsend/                   # Step 1: Register - Email for OTP
│   │   ├── verify-otp/                # Step 2: Register/Reset - OTP verification
│   │   ├── register/                  # Step 3: Register - Profile completion
│   │   ├── login/                     # Login - Direct email/password
│   │   ├── reset-password/            # Password reset (email & new password)
│   │   └── reset-password-otp/        # Password reset - OTP verification
│   ├── dashboard/                     # Protected dashboard pages
│   │   ├── page.tsx                   # Main dashboard hub
│   │   ├── resume/                    # Resume upload
│   │   ├── job-analysis/              # Job matching analysis
│   │   └── interview-prep/            # Interview questions
│   ├── layout.tsx                     # Root layout with metadata
│   ├── globals.css                    # Global styles
│   └── page.tsx                       # Landing page with features
├── public/                            # Static assets
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript config
├── next.config.ts                     # Next.js config
└── tailwind.config.ts                 # Tailwind configuration
```

---

## 🔐 Authentication Flows

### 1. Register Flow
> **Path:** Email ➡️ OTP Verify ➡️ Profile Complete

1. **`/auth/otpsend`**: User enters email ➡️ Calls `POST /api/auth/send-otp` ➡️ Redirects to verification.
2. **`/auth/verify-otp`**: User enters 6-digit OTP ➡️ Calls `POST /api/auth/verify-otp` ➡️ On success, proceeds to registration.
3. **`/auth/register`**: Requires `verified=true` parameter. User enters details. Password strength is evaluated. Stores `authToken` and redirects to dashboard.

### 2. Login Flow
> **Path:** Direct Email/Password

- **`/auth/login`**: User enters email and password. Calls `POST /api/auth/login`. On success, stores `authToken` and redirects to dashboard.

### 3. Password Reset Flow
> **Path:** Email ➡️ OTP Verify ➡️ New Password

1. **`/auth/reset-password` (step=email)**: User enters email. Redirects to OTP entry.
2. **`/auth/reset-password-otp`**: User enters 6-digit reset code. Validates and proceeds.
3. **`/auth/reset-password` (step=newpassword)**: User sets a new password. Redirects to Login on success.

---

## 🖥️ Pages

### Public Pages
- **Landing Page (`app/page.tsx`)**: Hero section, 3 feature cards, 4-step workflow, and auth links. Dark gradient background.

### Protected Pages (Require authToken)
- **Dashboard (`app/dashboard/page.tsx`)**: Main hub with statistics (resume count, jobs analyzed, avg match score).
- **Resume Upload (`app/dashboard/resume/page.tsx`)**: Drag-drop file upload. PDF/DOCX only (max 5MB).
- **Job Analysis (`app/dashboard/job-analysis/page.tsx`)**: Input JD, get match score, eligibility, strengths, weaknesses, and color-coded scoring (🟩/🟨/🟥).
- **Interview Prep (`app/dashboard/interview-prep/page.tsx`)**: Expandable AI question cards and STAR method tips.

---

## 📡 API Endpoints Interfaced

### Authentication
| Method | Endpoint | Description |
|:---:|:---|:---|
| <kbd>POST</kbd> | `/api/auth/send-otp` | Trigger OTP for email |
| <kbd>POST</kbd> | `/api/auth/verify-otp` | Verify registration OTP |
| <kbd>POST</kbd> | `/api/auth/register` | Finalize user registration |
| <kbd>POST</kbd> | `/api/auth/login` | Obtain auth token |
| <kbd>POST</kbd> | `/api/auth/request-reset`| Request password reset |
| <kbd>POST</kbd> | `/api/auth/reset-password`| Set new password |

### Core Features
| Method | Endpoint | Description |
|:---:|:---|:---|
| <kbd>POST</kbd> | `/api/resume/upload` | Upload resume file |
| <kbd>POST</kbd> | `/api/resume/analyze` | Match resume vs JD |
| <kbd>POST</kbd> | `/api/questions/generate`| Get tailored questions |

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation & Development
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local and add the backend URL
echo NEXT_PUBLIC_API_URL=https://interviewcoach-ai-backend.onrender.com > .env.local

# Start development server
npm run dev
# Running on http://localhost:3000
```

### Build for Production
```bash
# Make sure your deployment environment has NEXT_PUBLIC_API_URL set to the backend
npm run build
npm start
```

---

## 🎨 Design System

- **Color Palette:** Primary (`Blue-400`/`Cyan-400` gradients), Background (`Slate-900`), Text (`White`/`Slate-400`). Status colors included.
- **Typography:** `Geist Sans`, `Geist Mono`.
- **UI Details:** Dark theme, backdrop blur effects, real-time password strength indicators, smooth transitions.

---

<div align="center">
  <p><i>Proprietary - Interview Coach AI</i></p>
</div>
