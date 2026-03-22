# 🚀 Quick Start Guide

## Running Locally in VS Code

### 1️⃣ Open Terminal in VS Code
- Press `Ctrl + ~` (Windows/Linux) or `Cmd + ~` (Mac)

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Start Development Server
```bash
npm run dev
```

### 4️⃣ Open in Browser
- Navigate to: `http://localhost:5173`

## 🎯 Test the Application

### Create an Account
1. Click **"Register"** button
2. Enter your details:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
3. Click **"Register"**

### Book a Workshop
1. Browse the workshop list
2. Click **"View Details"** on any workshop
3. Click **"Register Now"**
4. Enter test payment details:
   - Card Number: `4242 4242 4242 4242`
   - Name: `John Doe`
   - Expiry: `12/25`
   - CVV: `123`
5. Click **"Pay"**

### View Bookings
1. Click **"My Bookings"** in navigation
2. Download receipt (PDF)
3. Cancel booking if needed

## 🌐 Deploy to Vercel (2 Minutes)

### Option 1: GitHub + Vercel (Easiest)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Deploy"
   - Done! 🎉

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 📋 Default Test Accounts

After first registration, you can use these workflows:

**New User Registration:**
- Any email format works
- Password minimum 6 characters
- Auto-login after registration

**Test Payment:**
- Any 16-digit card number
- Any future expiry date
- Any 3-digit CVV

## 🎨 Features to Try

✅ **Search & Filter**
- Use the search bar on home page
- Filter by category dropdown

✅ **Seat Availability**
- Watch seats decrease after booking
- Progress bar shows availability
- Sold out workshops are disabled

✅ **Booking Management**
- View all bookings
- Download PDF receipts
- Cancel confirmed bookings
- Seats return after cancellation

✅ **Responsive Design**
- Try on mobile, tablet, desktop
- Adaptive navigation
- Touch-friendly interface

## 🔍 Quick Troubleshooting

**Port already in use?**
```bash
# Kill the process and restart
npx kill-port 5173
npm run dev
```

**Dependencies not installing?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Page not found after deployment?**
- Vercel automatically handles SPA routing
- If issues persist, add `vercel.json` (see DEPLOYMENT_GUIDE.md)

## 📞 Need Help?

Check the full **DEPLOYMENT_GUIDE.md** for detailed instructions!
