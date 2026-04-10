# 📝 Step-by-Step Execution Guide

## Complete Implementation Guide for Workshop Registration System

This guide provides detailed, step-by-step instructions to implement and deploy your workshop registration system in VS Code and deploy it to Vercel.

---

## 📦 Part 1: Setting Up in VS Code

### Step 1: Verify Prerequisites

Before starting, ensure you have:
- ✅ **Node.js** (v18 or higher) - Check version: `node --version`
- ✅ **npm** (comes with Node.js) - Check version: `npm --version`
- ✅ **VS Code** installed
- ✅ **Git** installed (for deployment)

**Don't have Node.js?** Download from [nodejs.org](https://nodejs.org/)

---

### Step 2: Open Project in VS Code

1. **Launch VS Code**

2. **Open the project folder:**
   - Click **File** → **Open Folder**
   - Navigate to your project directory
   - Click **Select Folder**

3. **Verify project structure:**
   ```
   Your project should contain:
   ├── src/
   ├── package.json
   ├── vite.config.ts
   ├── README.md
   └── ... other files
   ```

---

### Step 3: Open Integrated Terminal

In VS Code:
- **Windows/Linux:** Press `Ctrl + ~` or `Ctrl + J`
- **Mac:** Press `Cmd + ~` or `Cmd + J`

Or click: **Terminal** → **New Terminal** from the menu

You should see a terminal panel at the bottom of VS Code.

---

### Step 4: Install Dependencies

In the terminal, run:

```bash
npm install
```

**What this does:**
- Installs all required packages (React, TypeScript, Tailwind, etc.)
- Downloads dependencies to `node_modules/` folder
- May take 1-3 minutes depending on your internet speed

**Expected output:**
```
added 1234 packages in 45s
```

**If you see errors:**
```bash
# Clear cache and retry
npm cache clean --force
npm install
```

---

### Step 5: Start Development Server

Run the development server:

```bash
npm run dev
```

**Expected output:**
```
  VITE v6.3.5  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**What this means:**
- ✅ Server is running
- ✅ Application available at `http://localhost:5173`
- ✅ Hot reload enabled (changes update automatically)

---

### Step 6: Open in Browser

1. **Click the link** in terminal output: `http://localhost:5173`
   
   OR

2. **Manually open browser** and navigate to: `http://localhost:5173`

You should see the Workshop Registration System!

---

### Step 7: Test the Application

#### 7.1 Create an Account

1. Click **"Register"** button in the top-right
2. Fill in the form:
   - **Name:** `John Doe`
   - **Email:** `john@example.com`
   - **Password:** `password123`
   - **Confirm Password:** `password123`
3. Click **"Register"**
4. You'll be automatically logged in and redirected to the home page

#### 7.2 Browse Workshops

1. See the list of 8 pre-loaded workshops
2. Try the **search bar**: type "React" or "Python"
3. Use the **category filter** dropdown
4. Notice the seat availability indicators

#### 7.3 View Workshop Details

1. Click **"View Details"** on any workshop
2. Observe:
   - Workshop information
   - Instructor details
   - Date and time
   - Seat availability progress bar
   - Skills you'll learn
3. Click **"Register Now"**

#### 7.4 Complete Payment

1. Fill in the payment form (simulation - test data):
   - **Cardholder Name:** `John Doe`
   - **Card Number:** `4242 4242 4242 4242` (spaces auto-format)
   - **Expiry Date:** `12/25`
   - **CVV:** `123`
2. Click **"Pay $XX.XX"**
3. Wait 2 seconds (simulated processing)
4. See the success confirmation page

#### 7.5 Download Receipt

1. On the success page, click **"Download Receipt"**
2. A PDF file will download to your Downloads folder
3. Open the PDF to verify the receipt details

#### 7.6 View Bookings

1. Click **"My Bookings"** in the navigation
2. See your confirmed booking
3. Try these actions:
   - **View Workshop**: Goes back to workshop details
   - **Download Receipt**: Downloads PDF again
   - **Cancel Booking**: Opens confirmation dialog

#### 7.7 Cancel a Booking

1. In "My Bookings", click **"Cancel Booking"**
2. Confirm the cancellation
3. See:
   - Status changes to "CANCELLED"
   - Success message appears
   - Seat is released (check workshop details)

#### 7.8 Test Search and Filter

1. Go back to home page
2. Search for "Python" - should show Python workshop
3. Filter by "Design" category - should show UI/UX workshop
4. Clear filters to see all workshops again

---

### Step 8: Development Workflow

**Making changes:**
1. Edit any file in `src/` folder
2. Save the file (`Ctrl+S` / `Cmd+S`)
3. Browser automatically refreshes with changes

**Stop the server:**
- Press `Ctrl+C` in the terminal
- Type `Y` if prompted

**Restart the server:**
```bash
npm run dev
```

---

## 🌐 Part 2: Deploying to Vercel

### Method A: Deploy via GitHub (Recommended)

#### Step 1: Create GitHub Repository

1. **Go to GitHub:**
   - Visit [github.com](https://github.com)
   - Log in or create account

2. **Create new repository:**
   - Click **"+"** icon → **"New repository"**
   - Name: `workshop-registration-system`
   - Keep it **Public** or **Private**
   - **Don't** initialize with README (we already have files)
   - Click **"Create repository"**

#### Step 2: Push Code to GitHub

In VS Code terminal, run these commands one by one:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - Workshop Registration System"

# Add GitHub remote (replace with YOUR repository URL)
git remote add origin https://github.com/YOUR_USERNAME/workshop-registration-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your actual GitHub username!

**Example:**
```bash
git remote add origin https://github.com/johndoe/workshop-registration-system.git
```

#### Step 3: Deploy on Vercel

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Click **"Sign Up"** or **"Log In"**
   - Sign in with GitHub

2. **Import Project:**
   - Click **"Add New..."** → **"Project"**
   - You'll see your GitHub repositories
   - Find `workshop-registration-system`
   - Click **"Import"**

3. **Configure Project:**
   - **Framework Preset:** Vite (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `dist` (auto-filled)
   - Click **"Deploy"**

4. **Wait for Deployment:**
   - Watch the build logs
   - Takes 30-60 seconds
   - See progress: Installing → Building → Deploying

5. **Success! 🎉**
   - You'll see: "Congratulations! Your project has been deployed"
   - Your app URL: `https://your-project.vercel.app`
   - Click the URL to open your live app

---

### Method B: Deploy via Vercel CLI

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts:
1. Enter your email
2. Check your email for verification link
3. Click the link to verify

#### Step 3: Deploy

```bash
# Navigate to your project directory
cd path/to/your/project

# Deploy to preview
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - What's your project's name? workshop-registration-system
# - In which directory? ./ (press Enter)
# - Override settings? N
```

#### Step 4: Deploy to Production

```bash
vercel --prod
```

Your app is now live! You'll receive a production URL.

---

## 🔧 Part 3: Troubleshooting

### Issue: Port 5173 Already in Use

**Error:**
```
Port 5173 is in use, trying another one...
```

**Solution 1:** Use the new port shown
**Solution 2:** Kill the process:
```bash
# Windows
npx kill-port 5173

# Mac/Linux
lsof -ti:5173 | xargs kill
```

### Issue: Cannot Find Module Errors

**Error:**
```
Cannot find module 'react' or its corresponding type declarations
```

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build Fails on Vercel

**Check:**
1. ✅ Verify `package.json` has `"build": "vite build"`
2. ✅ Check Vercel build logs for specific errors
3. ✅ Ensure all dependencies are in `dependencies`, not `devDependencies`

**Solution:**
```bash
# Test build locally first
npm run build

# If successful, preview the build
npm run preview
```

### Issue: Blank Page After Deployment

**Likely cause:** SPA routing not configured

**Solution:** Ensure `vercel.json` exists:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Issue: Images Not Loading

**Check:** Browser console (F12) for errors

**Solution:** Verify internet connection (images load from Unsplash)

---

## 📊 Part 4: Understanding the Application

### File Structure Breakdown

```
src/app/
├── components/
│   ├── ui/                    # Reusable components (Button, Card, etc.)
│   ├── Navbar.tsx             # Top navigation bar
│   ├── WorkshopCard.tsx       # Workshop display card
│   └── ProtectedRoute.tsx     # Authentication guard
├── contexts/
│   ├── AuthContext.tsx        # User login/register state
│   └── WorkshopContext.tsx    # Workshop data & bookings
├── pages/
│   ├── Login.tsx              # Login page
│   ├── Register.tsx           # Sign up page
│   ├── Home.tsx               # Workshop list
│   ├── WorkshopDetails.tsx    # Individual workshop
│   ├── Payment.tsx            # Payment form
│   ├── PaymentSuccess.tsx     # Confirmation
│   └── BookingHistory.tsx     # User's bookings
├── routes.tsx                 # URL routing configuration
└── App.tsx                    # Main app entry point
```

### How Data Flows

1. **User Authentication:**
   - Registration/Login → `AuthContext`
   - Stored in `localStorage`
   - Persists across page refreshes

2. **Workshop Data:**
   - Pre-loaded in `WorkshopContext`
   - 8 sample workshops included
   - Seat availability updates in real-time

3. **Bookings:**
   - Created on successful payment
   - Linked to user ID and workshop ID
   - Stored in `localStorage`
   - Can be cancelled (releases seat)

4. **Receipts:**
   - Generated using jsPDF library
   - Contains all booking details
   - Downloads as PDF file

---

## 🎯 Part 5: Next Steps

### Customize Your Application

#### Add New Workshops

Edit `/src/app/contexts/WorkshopContext.tsx`:

```typescript
const INITIAL_WORKSHOPS: Workshop[] = [
  // ... existing workshops
  {
    id: '9',
    title: 'Your New Workshop',
    instructor: 'Instructor Name',
    date: '2026-06-01',
    time: '2:00 PM',
    duration: '3 hours',
    category: 'Your Category',
    description: 'Workshop description...',
    price: 89.99,
    totalSeats: 40,
    availableSeats: 40,
    image: 'relevant search keywords',
    skills: ['Skill 1', 'Skill 2'],
  },
];
```

#### Change Theme Colors

Edit `/src/styles/theme.css` to modify colors, fonts, etc.

#### Add More Features

Consider adding:
- Email reminders
- Calendar export (.ics files)
- Social sharing
- Reviews and ratings
- Certificate generation

### Deploy Updates

**After making changes:**

```bash
# Commit changes
git add .
git commit -m "Description of changes"
git push

# Vercel automatically redeploys!
# Or manually: vercel --prod
```

---

## ✅ Checklist

### Local Development
- [ ] Node.js installed and verified
- [ ] Project opened in VS Code
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] Application accessible at localhost
- [ ] Test registration working
- [ ] Test booking flow complete
- [ ] Receipt download working

### Deployment
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Build successful
- [ ] Live URL accessible
- [ ] All features working on production
- [ ] No console errors

---

## 🆘 Getting Help

**Resources:**
- 📖 `README.md` - Project overview
- 🚀 `QUICK_START.md` - Quick reference
- 📚 `DEPLOYMENT_GUIDE.md` - Detailed deployment info

**Common Commands:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
vercel           # Deploy to Vercel
vercel --prod    # Deploy to production
```

**Debug Mode:**
```bash
# Check for errors
npm run build

# See detailed logs
npm run dev -- --debug
```

---

## 🎉 Congratulations!

You now have a fully functional workshop registration system running locally and deployed to the web!

**Your live app URL:** `https://your-project.vercel.app`

Share it with others, test all features, and customize it to your needs!

---

**Questions or issues?** Check the troubleshooting section or review the detailed guides in the project documentation.
