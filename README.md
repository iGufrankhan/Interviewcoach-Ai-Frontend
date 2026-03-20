# Interview Coach AI - Frontend

AI-powered interview preparation and resume analysis system built with Next.js 14+, TypeScript, and Tailwind CSS.

## Overview

Interview Coach AI helps job seekers prepare for interviews with:
- **Resume Analysis**: Analyze your resume against job descriptions for match scoring
- **Interview Questions**: Generate AI-powered interview questions tailored to your profile
- **Profile Management**: Store and manage your professional profile and resume

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI/UX**: Dark theme with gradient accents, backdrop blur effects
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: URL-based parameter passing and query strings

## Project Structure

```
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

## Authentication Flows

### 1. Register Flow
**Path**: Email → OTP Verify → Profile Complete

1. **[/auth/otpsend](app/auth/otpsend/page.tsx)**
   - User enters email
   - Calls POST `/api/auth/send-otp`
   - Redirects to `/auth/verify-otp?email={email}&type=register`

2. **[/auth/verify-otp](app/auth/verify-otp/page.tsx)** (Register Mode)
   - User enters 6-digit OTP code
   - Calls POST `/api/auth/verify-otp`
   - On success → redirects to `/auth/register?email={email}&verified=true`

3. **[/auth/register](app/auth/register/page.tsx)**
   - Requires `verified=true` parameter (safety gate)
   - User enters: Full Name, Password, Confirm Password
   - Password strength indicator (weak/medium/strong)
   - Calls POST `/api/auth/register`
   - On success → stores authToken in localStorage, redirects to dashboard

### 2. Login Flow
**Path**: Direct Email/Password

- **[/auth/login](app/auth/login/page.tsx)**
  - User enters email and password
  - Optional: Remember me checkbox
  - Calls POST `/api/auth/login`
  - On success → stores authToken in localStorage, redirects to dashboard
  - Link to password reset available

### 3. Password Reset Flow
**Path**: Email → OTP Verify → New Password

1. **[/auth/reset-password](app/auth/reset-password/page.tsx)** (step=email)
   - User enters email to reset
   - Calls POST `/api/auth/request-reset`
   - Redirects to `/auth/reset-password-otp?email={email}`

2. **[/auth/reset-password-otp](app/auth/reset-password-otp/page.tsx)**
   - User enters 6-digit reset code
   - Calls POST `/api/auth/verify-reset-otp`
   - On success → redirects to `/auth/reset-password?email={email}&step=newpassword&verified=true`

3. **[/auth/reset-password](app/auth/reset-password/page.tsx)** (step=newpassword)
   - Requires `verified=true` parameter (safety gate)
   - User enters: New Password, Confirm Password
   - Password strength indicator
   - Calls POST `/api/auth/reset-password`
   - On success → redirects to `/auth/login`

## Pages

### Public Pages

#### Landing Page ([app/page.tsx](app/page.tsx))
- Hero section with value proposition
- 3 feature cards: Resume Analysis, Interview Questions, Profile Management
- 4-step workflow visualization
- Call-to-action buttons linking to auth flows
- Dark gradient background with accent colors

### Authentication Pages
See **Authentication Flows** section above.

### Protected Pages (Require authToken)

#### Dashboard ([app/dashboard/page.tsx](app/dashboard/page.tsx))
- Main hub showing quick action cards
- Statistics: Resume count, jobs analyzed, questions generated, avg match score
- Navigation to: Resume upload, Job analysis, Interview prep

#### Resume Upload ([app/dashboard/resume/page.tsx](app/dashboard/resume/page.tsx))
- Drag-drop file upload
- File browser upload alternative
- Validation: PDF/DOCX only, max 5MB
- Calls POST `/api/resume/upload`

#### Job Analysis ([app/dashboard/job-analysis/page.tsx](app/dashboard/job-analysis/page.tsx))
- Textarea for job description input
- Analysis results with:
  - Match score (0-100)
  - Eligibility status (YES/PARTIAL/NO)
  - Strengths list
  - Weaknesses list
  - Improvement suggestions
- Color-coded scoring (green ≥80, yellow ≥60, red <60)
- Calls POST `/api/resume/analyze`

#### Interview Prep ([app/dashboard/interview-prep/page.tsx](app/dashboard/interview-prep/page.tsx))
- Generates 10 interview questions
- Expandable question cards (Q1-Q10)
- STAR method tips section
- Calls POST `/api/questions/generate`

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/auth/send-otp` | `{ email }` | `{ success: bool, message: string }` |
| POST | `/api/auth/verify-otp` | `{ email, otp }` | `{ success: bool, message: string }` |
| POST | `/api/auth/register` | `{ email, fullName, password }` | `{ authToken: string }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ authToken: string }` |
| POST | `/api/auth/request-reset` | `{ email }` | `{ success: bool, message: string }` |
| POST | `/api/auth/verify-reset-otp` | `{ email, otp }` | `{ success: bool, message: string }` |
| POST | `/api/auth/reset-password` | `{ email, newPassword }` | `{ success: bool, message: string }` |

### Resume Endpoints

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/resume/upload` | FormData with file | `{ success: bool, resumeId: string }` |
| POST | `/api/resume/analyze` | `{ jobDescription: string }` | `{ matchScore, eligibility, strengths, weaknesses, suggestions }` |

### Questions Endpoints

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/questions/generate` | `{}` | `{ questions: [{ id, question, tips }] }` |

## Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables (if needed)
# Create a .env.local file with any required API endpoints
```

### Development

```bash
# Start development server
npm run dev

# Server runs on http://localhost:3000
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## Key Features

### Security
- ✅ Email verification with OTP for registration
- ✅ Separate OTP flows for registration and password reset
- ✅ Validation gates prevent skipping auth steps
- ✅ Auth token stored in localStorage for persistence
- ✅ Protected routes check for valid token

### UI/UX
- ✅ Dark theme with gradient design
- ✅ Responsive layout (mobile-first)
- ✅ Real-time password strength indicator
- ✅ Loading states on all forms
- ✅ Comprehensive error/success messaging
- ✅ Backdrop blur effects for depth
- ✅ Smooth transitions and hover effects

### Form Validation
- ✅ Email format validation
- ✅ Password strength requirements (8+ chars, uppercase, numbers)
- ✅ Password matching validation
- ✅ OTP format validation (6 digits only)
- ✅ File type validation (PDF/DOCX)
- ✅ File size validation (5MB max)

## Design System

### Color Palette
- **Primary**: Blue-400 / Cyan-400 (gradients)
- **Background**: Slate-900 / Slate-800 / Slate-700
- **Text**: White (primary), Slate-400 (secondary)
- **Status**: Green-500 (success), Red-500 (error), Yellow-500 (warning)

### Typography
- **Font**: Geist Sans, Geist Mono
- **H1**: 2xl, bold
- **H2**: xl, semibold
- **Body**: sm, regular
- **Caption**: xs, regular

## State Management Pattern

- **Form State**: `useState` for form inputs
- **UI State**: `useState` for loading, error, success
- **URL State**: `useSearchParams` for multi-step flows
- **Navigation**: `useRouter` from next/navigation
- **Persistence**: localStorage for authToken

## Future Enhancements

- [ ] Backend API implementation
- [ ] JWT token validation and refresh
- [ ] Resume file processing and storage
- [ ] LLM integration for analysis and question generation
- [ ] User profile management
- [ ] Interview history tracking
- [ ] Analytics dashboard
- [ ] Social sharing
- [ ] Mobile app version

## Contributing

1. Follow TypeScript strict mode
2. Use Tailwind CSS for styling (no inline CSS)
3. Maintain consistent component structure
4. Add proper error handling and loading states
5. Test auth flows thoroughly

## License

Proprietary - Interview Coach AI

---

**Need Help?**
- Check auth flows in this README for routing questions
- Review component files for implementation details
- Verify API endpoint expectations before backend integration
