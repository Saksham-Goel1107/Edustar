# 🚀 Edustar - Modern Learning Management System

<div align="center">
  
[![GitHub stars](https://img.shields.io/github/stars/Saksham-Goel1107/EduStar.svg?style=for-the-badge)](https://github.com/Saksham-Goel1107/EduStar/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Saksham-Goel1107/EduStar.svg?style=for-the-badge)](https://github.com/Saksham-Goel1107/EduStar/network)
[![GitHub issues](https://img.shields.io/github/issues/Saksham-Goel1107/EduStar.svg?style=for-the-badge)](https://github.com/Saksham-Goel1107/EduStar/issues)
[![GitHub license](https://img.shields.io/github/license/Saksham-Goel1107/Edustar.svg?style=for-the-badge)](https://github.com/Saksham-Goel1107/Edustar)
[![Next.js](https://img.shields.io/badge/Next.js-13+-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-4.0+-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Integration-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Neon](https://img.shields.io/badge/Neon-Database-336791?style=for-the-badge&logo=neon&logoColor=white)](https://www.neon.com/)

</div>

## 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Payment Integration](#-payment-integration)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## 🌟 Overview

EduStar is a comprehensive, modern Learning Management System designed to provide an immersive educational experience. Built with Next.js 13+ App Router, this platform offers course creation, management, enrollment, and learning progress tracking in an intuitive interface.

The system supports teacher and student roles, secure payments via Stripe, rich content including videos and attachments, and interactive quizzes with automatic grading.

## ✨ Features

### 🧑‍🎓 For Students
- **Course Discovery & Enrollment**: Browse, search, and enroll in courses with secure payment processing
- **Personalized Dashboard**: Track learning progress, view enrolled courses, and access recently viewed content
- **Interactive Learning**: Watch video lectures, add notes, complete quizzes, and receive instant feedback
- **Course Feedback**: Rate and review courses after completion
- **Examinations**: Take course exams and get detailed results

### 👨‍🏫 For Teachers
- **Course Creation**: Intuitive course builder with rich text editor, video uploads, and attachment support
- **Chapter Management**: Organize content into chapters with custom ordering
- **Analytics Dashboard**: Track course enrollment, engagement metrics, and student performance
- **Monetization**: Set pricing for courses with integrated payment processing
- **Publishing Controls**: Preview courses before publishing and manage visibility

### 🔧 System Features
- **Authentication**: Secure user authentication and role-based access control
- **Payment Processing**: Stripe integration for secure course purchases
- **Responsive Design**: Fully responsive UI that works on mobile, tablet, and desktop
- **Dark/Light Mode**: Theme toggle for user preference
- **Real-time Updates**: Live feedback and notifications for user actions

## 🛠 Tech Stack

- **Frontend**: Next.js 13+, React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Clerk
- **Payment Processing**: Stripe
- **Content**: Mux for video hosting, UploadThing for file uploads
- **Deployment**: Vercel (recommended)

## 🏗 Architecture

The application follows a modern architecture leveraging Next.js App Router:

```
app/
├── (auth)/ - Authentication routes
├── (course)/ - Course viewing and learning
├── (dashboard)/ - User dashboard
│   ├── (routes)/
│   │   ├── teacher/ - Teacher specific routes
│   │   └── ...other dashboard routes
└── api/ - Backend API routes
    ├── courses/ - Course related endpoints
    ├── webhook/ - Stripe webhook handler
    └── ...other API endpoints
```

## 🚀 Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/Saksham-Goel1107/EduStar.git
cd EduStar
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables** (see Environment Variables section)

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

6. **Seed the database (optional)**
```bash
node scripts/seed.js
```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/Edustar"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# UploadThing
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# MUX (Video)
MUX_TOKEN_ID=your_mux_token_id
MUX_TOKEN_SECRET=your_mux_token_secret

# Stripe
STRIPE_API_KEY=your_stripe_api_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Gemini api Keys
GEMINI_API_KEY=your_gemini_api

# Redis Setup
REDIS_URL=your_redis_url
REDIS_USERNAME=example_user
REDIS_PASSWORD=example_password
```

## 📘 Usage

After installation, the system will be available at `http://localhost:3000`.

### Teacher Role:
1. Sign in and navigate to the dashboard
2. Create a new course by clicking "Create Course"
3. Add chapters, descriptions, attachments, and videos
4. Set the course price (or make it free)
5. Publish the course when ready

### Student Role:
1. Browse available courses on the homepage
2. Enroll in courses (free or paid)
3. Access course content through your dashboard
4. Track progress through chapters and courses
5. Take exams and get feedback

## 📡 API Endpoints

The system provides several API endpoints:

- `GET /api/courses` - List all published courses
- `GET /api/courses/[courseId]` - Get details for a specific course
- `POST /api/courses/[courseId]/checkout` - Create a checkout session for course purchase
- `POST /api/courses/[courseId]/purchase` - Direct course purchase (fallback method)
- `GET /api/courses/[courseId]/verify-purchase` - Verify a user's purchase status
- `GET /api/courses/dashboard` - Get courses for the dashboard
- `POST /api/webhook` - Handle Stripe webhooks for purchase completion

## 🗄 Database Schema

The database schema includes the following main models:

- **User** - User information (managed by Clerk)
- **Course** - Course information, including title, description, price
- **Chapter** - Course chapters with content and videos
- **Purchase** - Records of course purchases
- **UserProgress** - Tracks user progress through chapters
- **Attachment** - Files attached to courses
- **Category** - Course categories
- **Question/Answer** - Exam questions and answers
- **Feedback** - User reviews for courses

## 💳 Payment Integration

The system integrates with Stripe for payment processing:

1. When a user purchases a course, a Stripe Checkout session is created
2. Upon successful payment, Stripe sends a webhook notification
3. The webhook handler creates a purchase record in the database
4. As a fallback, a direct purchase method is also available

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📬 Contact

**Saksham Goel** - Developer and Maintainer

- GitHub: [@Saksham-Goel1107](https://github.com/Saksham-Goel1107)

---

<div align="center">
  <p>Built with ❤️ by Saksham Goel</p>
  <p>© 2025 Edustar. All Rights Reserved.</p>
</div>
