# Workshop Registration System - Deployment Guide

## 📋 Overview

A complete Online Workshop/Seminar Registration System built with React, TypeScript, and Tailwind CSS. This application includes user authentication, workshop browsing, booking management, payment simulation, and receipt generation.

## ✨ Features

✅ **User Authentication**
- Register new account
- Login/Logout functionality
- Protected routes for authenticated users

✅ **Workshop Management**
- Browse upcoming workshops
- Search and filter by category
- View detailed workshop information
- Real-time seat availability tracking

✅ **Booking System**
- Register for workshops
- Simulated payment processing
- Booking confirmation
- View booking history
- Cancel bookings

✅ **Payment & Receipts**
- Secure payment simulation
- Payment success confirmation
- Download PDF receipts
- Transaction tracking

## 🚀 Step-by-Step Setup in VS Code

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **VS Code** - [Download here](https://code.visualstudio.com/)
- **Git** - [Download here](https://git-scm.com/)

### Step 1: Open Project in VS Code

1. Open VS Code
2. Click **File** → **Open Folder**
3. Navigate to your project directory and open it

### Step 2: Install Dependencies

Open the integrated terminal in VS Code:
- Windows/Linux: Press `Ctrl + ~`
- Mac: Press `Cmd + ~`

Then run:

```bash
npm install
```

or if you're using pnpm:

```bash
pnpm install
```

### Step 3: Run Development Server

In the terminal, run:

```bash
npm run dev
```

or with pnpm:

```bash
pnpm dev
```

The application will start at `http://localhost:5173`

### Step 4: Test the Application

1. **Register a new account:**
   - Go to `http://localhost:5173`
   - Click "Register"
   - Fill in your details and create an account

2. **Browse workshops:**
   - View the list of available workshops
   - Use search and filters to find specific workshops

3. **Book a workshop:**
   - Click on a workshop to view details
   - Click "Register Now"
   - Fill in payment details (use any test card number like `4242 4242 4242 4242`)
   - Complete the booking

4. **Manage bookings:**
   - Go to "My Bookings" in the navigation
   - Download receipts
   - Cancel bookings if needed

## 🌐 Deploy to Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Create a Vercel account:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub, GitLab, or Bitbucket

2. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

3. **Import to Vercel:**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect the framework (Vite)
   - Click "Deploy"

4. **Done!** Your app will be live at `your-project.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Link to existing project or create new
   - Confirm settings
   - Deploy!

5. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### Vercel Configuration

The project includes optimal settings for Vercel. If you need to customize, create a `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── WorkshopCard.tsx # Workshop card component
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── contexts/
│   │   ├── AuthContext.tsx      # Authentication state
│   │   └── WorkshopContext.tsx  # Workshop & booking state
│   ├── pages/
│   │   ├── Login.tsx            # Login page
│   │   ├── Register.tsx         # Registration page
│   │   ├── Home.tsx             # Workshop listing
│   │   ├── WorkshopDetails.tsx  # Workshop details
│   │   ├── Payment.tsx          # Payment page
│   │   ├── PaymentSuccess.tsx   # Success page
│   │   └── BookingHistory.tsx   # User bookings
│   ├── routes.tsx           # Route configuration
│   └── App.tsx             # Main app component
└── styles/                 # Global styles
```

## 🔧 Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router 7** - Routing
- **Tailwind CSS v4** - Styling
- **Radix UI** - Accessible components
- **Lucide React** - Icons
- **jsPDF** - PDF generation
- **Vite** - Build tool

## 💾 Data Storage

The application uses **localStorage** for data persistence:
- User accounts
- Workshop data
- Booking history
- Authentication state

**Note:** Data is stored locally in the browser and will be cleared if browser data is cleared.

## 🎨 Customization

### Adding New Workshops

Edit `/src/app/contexts/WorkshopContext.tsx` and add to the `INITIAL_WORKSHOPS` array:

```typescript
{
  id: '9',
  title: 'Your Workshop Title',
  instructor: 'Instructor Name',
  date: '2026-05-15',
  time: '10:00 AM',
  duration: '3 hours',
  category: 'Category Name',
  description: 'Workshop description...',
  price: 99.99,
  totalSeats: 50,
  availableSeats: 50,
  image: 'search keywords for unsplash',
  skills: ['Skill 1', 'Skill 2'],
}
```

### Changing Theme Colors

Edit `/src/styles/theme.css` to customize colors, fonts, and other design tokens.

## 🐛 Troubleshooting

### Build Errors

If you encounter build errors:

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

2. Clear build cache:
   ```bash
   rm -rf dist
   npm run build
   ```

### Deployment Issues

1. Ensure `package.json` has correct scripts
2. Check that all dependencies are listed
3. Verify Node.js version compatibility
4. Review Vercel build logs for specific errors

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔐 Security Notes

⚠️ **Important:** This is a demonstration application with simulated features:

- Passwords are stored in plain text in localStorage
- Payment processing is simulated (no real transactions)
- Not suitable for production use with real user data
- For production, implement proper backend authentication and payment processing

## 📄 License

This project is provided as-is for educational and demonstration purposes.

## 🤝 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify all dependencies are installed
3. Clear browser cache and localStorage
4. Review the deployment logs on Vercel

---

**Built with ❤️ using Figma Make**
