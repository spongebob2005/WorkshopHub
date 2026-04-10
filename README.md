# 🎓 Workshop Registration System

A modern, full-featured online workshop and seminar registration platform built with React, TypeScript, and Tailwind CSS.

![Workshop Registration System](https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=1200&h=400&fit=crop)

## ✨ Features

### 🔐 User Authentication
- **Register** - Create new account with validation
- **Login** - Secure authentication with protected routes
- **Session Management** - Persistent login state

### 📚 Workshop Management
- **Browse Workshops** - View all upcoming workshops in a beautiful grid layout
- **Search & Filter** - Find workshops by keyword or category
- **Detailed View** - See complete workshop information, instructor details, and skills
- **Real-time Availability** - Live seat count with visual progress indicators

### 🎫 Booking System
- **Easy Registration** - Simple click-to-register workflow
- **Seat Tracking** - Automatic seat availability updates
- **Booking Confirmation** - Instant confirmation with unique booking ID
- **Booking History** - View all past and upcoming bookings

### 💳 Payment Processing
- **Simulated Payments** - Safe testing environment with mock payment gateway
- **Secure Forms** - Validated payment details with card formatting
- **Payment Success** - Beautiful confirmation page with all details
- **Transaction Records** - Complete payment tracking

### 📄 Receipt Management
- **PDF Generation** - Professional PDF receipts
- **Download Receipts** - One-click receipt download from any booking
- **Complete Details** - All booking and payment information included

### 🔄 Booking Management
- **View All Bookings** - Comprehensive booking history
- **Cancel Bookings** - Easy cancellation with seat release
- **Status Tracking** - See confirmed and cancelled bookings
- **Refund Simulation** - Automatic seat return on cancellation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- VS Code (recommended)
- Git

### Installation

1. **Clone or navigate to the project directory**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

## 📖 User Guide

### Getting Started

1. **Register an Account**
   - Click "Register" in the top navigation
   - Fill in your name, email, and password (min 6 characters)
   - Submit to create your account

2. **Browse Workshops**
   - View all upcoming workshops on the home page
   - Use the search bar to find specific topics
   - Filter by category using the dropdown

3. **View Workshop Details**
   - Click "View Details" on any workshop card
   - See instructor info, schedule, skills, and seat availability
   - Check the progress bar for seat availability

4. **Book a Workshop**
   - Click "Register Now" on the workshop details page
   - Enter payment information (test mode - use any valid format):
     - Card Number: `4242 4242 4242 4242`
     - Expiry: `12/25`
     - CVV: `123`
   - Confirm payment to complete booking

5. **Manage Your Bookings**
   - Go to "My Bookings" in navigation
   - Download PDF receipts
   - Cancel bookings if needed (seat will be released)

## 🌐 Deployment to Vercel

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy via Vercel Dashboard:**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"
   - Your app is live! 🎉

### Method 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Build Configuration

The project is pre-configured for Vercel with:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Framework:** Vite
- **SPA Routing:** Automatic rewrites configured

## 🏗️ Project Structure

```
workshop-registration-system/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/                    # Reusable UI components
│   │   │   ├── Navbar.tsx             # Main navigation
│   │   │   ├── WorkshopCard.tsx       # Workshop card component
│   │   │   └── ProtectedRoute.tsx     # Authentication guard
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx        # User authentication state
│   │   │   └── WorkshopContext.tsx    # Workshop & booking data
│   │   ├── pages/
│   │   │   ├── Login.tsx              # Login page
│   │   │   ├── Register.tsx           # Registration page
│   │   │   ├── Home.tsx               # Workshop listing
│   │   │   ├── WorkshopDetails.tsx    # Workshop detail view
│   │   │   ├── Payment.tsx            # Payment processing
│   │   │   ├── PaymentSuccess.tsx     # Confirmation page
│   │   │   └── BookingHistory.tsx     # User bookings
│   │   ├── routes.tsx                 # Route configuration
│   │   └── App.tsx                    # Main app component
│   └── styles/                        # Global styles & theme
├── DEPLOYMENT_GUIDE.md                # Detailed deployment instructions
├── QUICK_START.md                     # Quick reference guide
└── README.md                          # This file
```

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **TypeScript** | Type safety |
| **React Router 7** | Client-side routing |
| **Tailwind CSS v4** | Utility-first styling |
| **Radix UI** | Accessible component primitives |
| **Lucide React** | Icon library |
| **jsPDF** | PDF generation |
| **Vite** | Build tool & dev server |

## 💾 Data Storage

Currently uses **localStorage** for:
- User authentication
- Workshop data
- Booking records
- Session management

**Note:** Data persists in the browser only. Clearing browser data will reset the application.

## 🎨 Sample Workshops Included

The application comes pre-loaded with 8 diverse workshops:

1. **Advanced React Patterns & Best Practices** - Web Development
2. **UI/UX Design Fundamentals** - Design
3. **Python for Data Science** - Data Science
4. **Digital Marketing Strategy 2026** - Marketing
5. **Cloud Architecture with AWS** - Cloud Computing
6. **Mobile App Development with React Native** - Mobile Development
7. **Cybersecurity Essentials** - Security
8. **Blockchain & Smart Contracts** - Blockchain

## 🔒 Security Considerations

⚠️ **Important Notice:**

This is a **demonstration application** with simulated features:

- ❌ Passwords stored in plain text (localStorage)
- ❌ No real payment processing
- ❌ No server-side validation
- ❌ Not production-ready for real user data

**For production use:**
- ✅ Implement proper backend authentication (e.g., Supabase, Firebase)
- ✅ Use secure payment gateways (e.g., Stripe, PayPal)
- ✅ Add server-side validation
- ✅ Implement proper session management
- ✅ Use HTTPS and secure cookies

## 📱 Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Use Cases

Perfect for:
- Workshop organizers
- Training companies
- Educational institutions
- Seminar planners
- Event management
- Online course platforms

## 🤝 Contributing

This is a demonstration project. Feel free to:
- Fork and modify for your needs
- Use as a learning resource
- Adapt for commercial projects
- Share and distribute

## 🧩 MongoDB Connection Setup

To enable MongoDB storage for real data persistence, add the following environment variables to your Supabase function runtime or local development environment:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
MONGODB_DB=workshophub
```

Then restart the server or redeploy the Supabase function. The backend automatically uses MongoDB when `MONGODB_URI` is present.

### Collections created automatically
- `users`
- `workshops`
- `bookings`
- `payments`
- `events`

> MongoDB collections are created automatically when the first document is inserted.

## 📄 License

MIT License - Free to use for any purpose.

## 🆘 Support & Troubleshooting

### Common Issues

**Issue:** Can't login after registering
- **Solution:** Check browser console, ensure localStorage is enabled

**Issue:** Bookings not saving
- **Solution:** Verify localStorage permissions, try incognito mode

**Issue:** Build fails on Vercel
- **Solution:** Check build logs, verify Node.js version (18+)

**Issue:** Routes not working after deployment
- **Solution:** Ensure `vercel.json` exists with SPA rewrites

### Getting Help

1. Check `DEPLOYMENT_GUIDE.md` for detailed setup
2. Review `QUICK_START.md` for common tasks
3. Check browser console for error messages
4. Verify all dependencies are installed

## 🎓 Learning Resources

This project demonstrates:
- React Context API for state management
- React Router v7 data routing
- TypeScript interfaces and types
- Tailwind CSS v4 utilities
- Form validation and handling
- PDF generation with jsPDF
- localStorage API usage
- Protected routes pattern
- Component composition

## 🚀 Next Steps

Want to enhance this project? Consider adding:

- [ ] Email notifications
- [ ] Calendar integration (Google Calendar, iCal)
- [ ] Social sharing features
- [ ] Reviews and ratings
- [ ] Workshop recommendations
- [ ] Live chat support
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Backend API integration
- [ ] Real payment processing

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

For quick reference, see [QUICK_START.md](./QUICK_START.md)
