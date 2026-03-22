# Interview Service Frontend

## Overview

The Interview Service frontend provides an AI-powered interview practice platform that generates personalized interview questions based on a job description and candidate's resume.

## Features

### 1. **Main Interview Page** (`(InterviewService)/page.tsx`)
- **Resume Selection**: Browse and select from uploaded resumes
- **Job Description Input**: Paste complete job descriptions
- **Question Generation**: Generate 10 personalized interview questions
- **Real-time Validation**: Form validation and error handling
- **Loading States**: User-friendly loading indicators

### 2. **Interview Practice Page** (`interview-results/page.tsx`)
- **Question Navigation**: Move between questions seamlessly
- **Answer Tracking**: Type and save answers for each question
- **Progress Tracking**: Visual progress bar showing completion
- **Job Context Display**: Reference job description while answering
- **Export Options**:
  - Download report as `.txt`
  - Export session as `.json` for analysis
- **Question List**: Quick jump to any question
- **Statistics**: Track total questions, answered questions, and current progress

## Component Structure

```
Frontend/app/
├── (InterviewService)/
│   └── page.tsx                 # Main interview setup page
├── interview-results/
│   └── page.tsx                 # Interview practice & results page
├── api/
│   └── generate-questions/
│       └── route.ts             # API bridge to backend
└── layout.tsx                   # Root layout
```

## API Integration

### Backend Endpoint
```
POST /interviewservice/question_gen/generate
Parameters:
  - description (string): Job description
  - resume_id (string): Selected resume ID
  
Authorization: Bearer {JWT_TOKEN}

Response:
{
  "questions": [
    "Question 1?",
    "Question 2?",
    ...
  ]
}
```

### Frontend API Route
```
POST /api/generate-questions
Body:
{
  "description": "Job description text",
  "resume_id": "resume_id_123"
}

Headers:
  Authorization: Bearer {JWT_TOKEN}
```

## Usage Flow

1. **Visit Interview Page**: Navigate to `/interview-service`
2. **Select Resume**: Choose from uploaded resumes
3. **Paste Job Description**: Provide the job posting details
4. **Generate Questions**: Click "Generate Interview Questions"
5. **Practice Answers**: Answer each question sequentially
6. **Export Results**: Download or export your practice session

## State Management

### Main Page State
- `resumes`: List of user's uploaded resumes
- `selectedResumeId`: Currently selected resume
- `jobDescription`: Job description text input
- `generating`: Loading state during question generation
- `error`: Error messages

### Results Page State
- `interviewData`: Generated questions and job context
- `currentQuestionIndex`: Current question being answered
- `userAnswers`: User's answers for each question
- `showFeedback`: Toggle job context visibility

## Data Flow

```
User Input (Resume + Job Description)
        ↓
Form Validation
        ↓
API Call to /api/generate-questions
        ↓
Backend Processing (FastAPI)
        ↓
Question Generation (LLM)
        ↓
Response with Questions
        ↓
Store in localStorage
        ↓
Navigate to Results Page
        ↓
Display & Practice Questions
        ↓
Export/Download Results
```

## Styling

- **Framework**: Tailwind CSS
- **Theme**: Dark mode with gradient backgrounds
- **Color Scheme**:
  - Primary: Blue (#3B82F6)
  - Secondary: Cyan (#06B6D4)
  - Background: Slate (#0F172A)
- **Components**: Custom styled with Tailwind classes

## Local Storage

Uses browser localStorage for:
- `token`: JWT authentication token
- `user_id`: Current user ID
- `interviewQuestions`: Session data with questions and answers

```javascript
{
  questions: string[],
  jobDescription: string,
  timestamp: ISO string,
  answers?: string[]
}
```

## Environment Variables

Frontend needs:
```
BACKEND_URL=http://localhost:8000
```

## Features Breakdown

### Question Selection
- Radio buttons for resume selection
- Visual feedback for selected resume
- Resume metadata display (name, email, skills)

### Job Description Input
- Large textarea for pasting job postings
- Character count display
- Form validation

### Answer Input
- Persistent answers while navigating
- Character tracking
- Resize disabled to maintain UI consistency

### Progress Tracking
- Visual progress bar
- Question counter
- Answered/total statistics
- Quick question list sidebar

### Export Options
- **Text Report**: Human-readable format
- **JSON Export**: Machine-readable for analysis

## Error Handling

- Missing resume selection validation
- Empty job description validation
- API error handling with user messages
- Failed resume fetch handling
- Network error recovery

## Future Enhancements

1. **AI Feedback**: Real-time feedback on answers
2. **Performance Metrics**: Score and rate answers
3. **Interview History**: Save and review past sessions
4. **Difficulty Levels**: Easy, Medium, Hard question options
5. **Time Tracking**: Timer for realistic interview practice
6. **Video Answer**: Record video responses
7. **Comparison**: Compare answers with ideal responses
8. **Follow-up Questions**: Generate contextual follow-ups
9. **Interview Tips**: Show tips based on question type
10. **Multi-language Support**: Generate questions in different languages

## Responsive Design

- Mobile-first approach
- Grid layout adjusts for different screen sizes
- Sidebar collapses on mobile
- Touch-friendly buttons and inputs

## Accessibility

- Semantic HTML elements
- Proper label associations
- Keyboard navigation support
- ARIA labels for screen readers

## Dependencies

- `next`: App framework
- `react`: UI library
- `tailwindcss`: Styling
- TypeScript: Type safety

## Running Locally

1. Ensure backend is running on `http://localhost:8000`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Navigate to `http://localhost:3000/interview-service`

## Backend Requirements

The backend must provide:
1. `/resume/get/{user_id}` - Get user's resumes
2. `/interviewservice/question_gen/generate` - Generate questions
3. JWT authentication middleware
4. CORS support for frontend requests

## Security

- JWT token validation on all requests
- Token stored in localStorage (consider secure cookie for production)
- XSS protection via React sanitization
- CSRF protection via API route
