# 🔐 Test Credentials & Data

Complete reference for all test credentials and data used in the Workshop Registration System.

---

## 👤 User Account Credentials

### Method 1: Register New Account (Recommended for First Use)

The system **does not have pre-created accounts**. You need to register a new account on first use.

**Steps:**
1. Click **"Register"** button (top-right)
2. Use any of these sample credentials or create your own:

#### Sample Test User 1
- **Name:** `John Doe`
- **Email:** `john@example.com`
- **Password:** `password123`
- **Confirm Password:** `password123`

#### Sample Test User 2
- **Name:** `Sarah Wilson`
- **Email:** `sarah.wilson@example.com`
- **Password:** `test1234`
- **Confirm Password:** `test1234`

#### Sample Test User 3
- **Name:** `Mike Johnson`
- **Email:** `mike.j@demo.com`
- **Password:** `demo2024`
- **Confirm Password:** `demo2024`

**Notes:**
- Passwords are stored in plain text in localStorage (frontend only)
- Once registered, you'll be automatically logged in
- User data persists in browser localStorage

---

### Method 2: Login with Existing Account

After registration, you can log in using:

**Email:** The email you registered with (e.g., `john@example.com`)  
**Password:** The password you set (e.g., `password123`)

**Login Process:**
1. Click **"Login"** button (top-right)
2. Enter your registered email
3. Enter your password
4. Click **"Login"**

---

## 💳 Payment Test Credentials

The payment system is **simulated** - no real transactions occur.

### Test Card Details (Use Any of These)

#### Primary Test Card (Recommended)
```
Cardholder Name: John Doe
Card Number: 4242 4242 4242 4242
Expiry Date: 12/25
CVV: 123
```

#### Alternative Test Cards

**Test Card 2:**
```
Cardholder Name: Jane Smith
Card Number: 4111 1111 1111 1111
Expiry Date: 06/26
CVV: 456
```

**Test Card 3:**
```
Cardholder Name: Test User
Card Number: 5555 5555 5555 4444
Expiry Date: 09/27
CVV: 789
```

**Test Card 4:**
```
Cardholder Name: Demo Account
Card Number: 3782 822463 10005
Expiry Date: 03/28
CVV: 321
```

### Payment Validation Rules

The system validates:
- ✅ **Card Number:** Must be exactly 16 digits (spaces auto-added)
- ✅ **CVV:** Must be exactly 3 digits
- ✅ **Expiry Date:** Format MM/YY (auto-formatted)
- ✅ **Cardholder Name:** Required field

**Note:** Any 16-digit number will work for testing purposes.

---

## 📚 Pre-loaded Workshop Data

The system includes **8 pre-loaded workshops**. You don't need to create workshops - they're ready to use.

### Workshop List

| ID | Workshop Title | Category | Price | Instructor | Date | Total Seats |
|----|---------------|----------|-------|------------|------|-------------|
| 1 | Advanced React Patterns | Development | $129.99 | Sarah Johnson | Apr 15, 2026 | 30 |
| 2 | Modern UI/UX Design | Design | $99.99 | Michael Chen | Apr 20, 2026 | 25 |
| 3 | Python for Data Science | Data Science | $149.99 | Dr. Emily Brown | Apr 25, 2026 | 35 |
| 4 | Digital Marketing Mastery | Marketing | $89.99 | David Martinez | May 1, 2026 | 40 |
| 5 | Cloud Architecture with AWS | Cloud Computing | $199.99 | Jennifer Lee | May 5, 2026 | 20 |
| 6 | Machine Learning Fundamentals | Data Science | $179.99 | Prof. Robert Taylor | May 10, 2026 | 30 |
| 7 | Mobile App Development | Development | $139.99 | Amanda White | May 15, 2026 | 28 |
| 8 | Cybersecurity Essentials | Security | $159.99 | James Anderson | May 20, 2026 | 25 |

### Search & Filter Test Cases

**Test Search Functionality:**
- Search: `"React"` → Returns "Advanced React Patterns"
- Search: `"Python"` → Returns "Python for Data Science"
- Search: `"Design"` → Returns UI/UX and potentially others
- Search: `"AWS"` → Returns "Cloud Architecture with AWS"

**Test Filter Functionality:**
- Filter by: `Development` → Shows React & Mobile App workshops
- Filter by: `Data Science` → Shows Python & Machine Learning
- Filter by: `Design` → Shows UI/UX workshop
- Filter by: `All Categories` → Shows all 8 workshops

---

## 🧪 Complete Testing Workflow

### Full End-to-End Test Scenario

#### Step 1: User Registration
```
Name: Test User
Email: testuser@demo.com
Password: test123456
Confirm Password: test123456
```
✅ Expected: Auto-login and redirect to home page

---

#### Step 2: Browse Workshops
- View all 8 workshops on home page
- Try search: `"React"`
- Try filter: `Development`

---

#### Step 3: Workshop Details
- Click **"View Details"** on "Advanced React Patterns"
- Review workshop information
- Check seat availability
- Click **"Register Now"**

---

#### Step 4: Payment
```
Cardholder Name: Test User
Card Number: 4242 4242 4242 4242
Expiry Date: 12/25
CVV: 123
```
- Click **"Pay $129.99"**
- Wait 2 seconds for processing simulation
✅ Expected: Redirect to success page

---

#### Step 5: Download Receipt
- Click **"Download Receipt"**
✅ Expected: PDF file downloads

---

#### Step 6: View Bookings
- Click **"My Bookings"** in navbar
✅ Expected: See confirmed booking for React workshop

---

#### Step 7: Cancel Booking
- Click **"Cancel Booking"**
- Confirm cancellation
✅ Expected: Status changes to "CANCELLED", seat released

---

#### Step 8: Verify Seat Release
- Go back to "Advanced React Patterns" details
✅ Expected: Available seats increased by 1

---

## 🗂️ Local Storage Data

All data is stored in browser's localStorage:

### Storage Keys

```javascript
localStorage keys:
- 'users' → All registered users
- 'currentUser' → Currently logged-in user
- 'bookings' → All workshop bookings
- 'workshopSeats' → Seat availability tracking
```

### View Storage (Developer Tools)

**Chrome/Edge:**
1. Press `F12`
2. Go to **Application** tab
3. Expand **Local Storage**
4. Click your site URL
5. View all data

**Firefox:**
1. Press `F12`
2. Go to **Storage** tab
3. Expand **Local Storage**
4. Click your site URL
5. View all data

### Clear All Data

To reset the application to initial state:

**Browser Console (F12):**
```javascript
localStorage.clear();
location.reload();
```

---

## 🎯 Quick Test Commands

### Create Multiple Test Users

**User 1:**
```
Email: alice@test.com
Password: alice123
```

**User 2:**
```
Email: bob@test.com
Password: bob123
```

**User 3:**
```
Email: charlie@test.com
Password: charlie123
```

### Test Different User Scenarios

1. **New User Journey:** Register → Browse → Book → Pay → View Booking
2. **Returning User:** Login → View Bookings → Book Another
3. **Multiple Bookings:** Book 2+ workshops with same user
4. **Cancellation:** Book → Cancel → Verify seat release
5. **Search/Filter:** Test all categories and search terms

---

## ⚠️ Important Notes

### Authentication
- ✅ No email verification required
- ✅ Passwords stored in plain text (localStorage)
- ✅ Auto-login after registration
- ✅ Session persists across page refreshes
- ❌ No password recovery (clear localStorage to reset)

### Payment Processing
- ✅ Completely simulated (no real charges)
- ✅ 2-second processing delay for realism
- ✅ Any 16-digit card number works
- ✅ No connection to actual payment gateways
- ⚠️ **Not for production use with real payments**

### Data Persistence
- ✅ Data stored in browser localStorage
- ✅ Persists across sessions
- ✅ Cleared when browser cache cleared
- ❌ Not shared between devices
- ❌ Not backed up anywhere

### Seat Availability
- ✅ Updates in real-time
- ✅ Decrements on booking
- ✅ Increments on cancellation
- ⚠️ Only enforced in frontend (no backend validation)

---

## 🔄 Reset/Clear Data

### Clear All User Data
```javascript
// Open browser console (F12) and run:
localStorage.removeItem('users');
localStorage.removeItem('currentUser');
localStorage.removeItem('bookings');
localStorage.removeItem('workshopSeats');
location.reload();
```

### Logout Current User Only
```javascript
// Open browser console (F12) and run:
localStorage.removeItem('currentUser');
location.reload();
```

### Reset Workshops to Default
```javascript
// Open browser console (F12) and run:
localStorage.removeItem('workshopSeats');
location.reload();
```

---

## 📞 Support

If you encounter issues:

1. **Check browser console** (F12) for errors
2. **Clear localStorage** and try again
3. **Verify you're using modern browser** (Chrome, Firefox, Edge, Safari)
4. **Check that JavaScript is enabled**
5. **Review STEP_BY_STEP_EXECUTION.md** for troubleshooting

---

## ✅ Testing Checklist

Use this checklist to verify all features:

### Authentication
- [ ] Register new user
- [ ] Login with credentials
- [ ] Logout
- [ ] Session persistence (refresh page while logged in)

### Workshop Browsing
- [ ] View all workshops
- [ ] Search by keyword
- [ ] Filter by category
- [ ] View workshop details

### Booking Process
- [ ] Select workshop
- [ ] Navigate to payment
- [ ] Enter payment details
- [ ] Complete payment
- [ ] View success page

### Receipt Management
- [ ] Download receipt (PDF)
- [ ] Verify receipt contents
- [ ] Re-download from bookings page

### Booking Management
- [ ] View booking history
- [ ] View active bookings
- [ ] Cancel booking
- [ ] Verify cancellation status

### System Features
- [ ] Seat availability updates
- [ ] Protected routes (try accessing /bookings while logged out)
- [ ] Responsive design (test on mobile/tablet)
- [ ] Toast notifications

---

**Last Updated:** March 22, 2026  
**System Version:** 1.0.0  
**Environment:** Frontend-only (localStorage)
