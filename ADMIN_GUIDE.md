# Admin Panel Guide - WorkshopHub

## Admin Login Credentials

**Email:** `admin@workshophub.com`  
**Password:** `admin123`

## Accessing the Admin Panel

1. Navigate to the **Login** page
2. Toggle to **Admin** login mode using the toggle buttons
3. Enter the admin credentials above
4. You'll be automatically redirected to the Admin Dashboard

## Admin Features

### 1. Dashboard Overview (`/admin`)
- **Statistics Cards**: View total students, workshops, bookings, and revenue
- **Quick Actions**: Fast navigation to management pages
- **System Status**: Real-time status of database and API connections

### 2. Workshop Management (`/admin/workshops`)
- **View All Workshops**: See all workshops with enrollment stats
- **Create Workshop**: Add new workshops with full details
- **Edit Workshop**: Update workshop information, pricing, seats, etc.
- **Delete Workshop**: Remove workshops from the system
- **Search**: Filter workshops by title, instructor, or category
- **Statistics**: View enrolled/total seats for each workshop

### 3. User Management (`/admin/users`)
- **View All Users**: See complete user list with roles
- **Toggle User Role**: Switch users between admin and student roles
- **Delete Users**: Remove users from the system
- **Search**: Filter users by name, email, or role
- **Statistics**: View total admins and students
- **User Details**: See user ID, name, email, and role badges

### 4. Registration Management (`/admin/registrations`)
- **View All Bookings**: See all workshop registrations
- **Registration Details**: View student info, workshop, date, price, payment method
- **Delete Registrations**: Remove bookings from the system
- **Search**: Filter by student name, email, or workshop
- **Revenue Statistics**: See total revenue and average per booking
- **Export Option**: Placeholder for CSV export functionality

## Navigation

### Admin Navbar
- **Dashboard**: Return to main admin overview
- **Workshops**: Manage workshops
- **Users**: Manage users and roles
- **Registrations**: View and manage bookings
- **Student View**: Quick link to return to student-facing site
- **Profile**: Shows logged-in admin name and email
- **Logout**: Sign out of admin session

### Student Navbar (when logged in as admin)
- **Admin Dashboard**: Quick access link to admin panel (visible only to admins)
- **Workshops**: Browse available workshops
- **My Bookings**: View your registered workshops

## Role-Based Access

- **Admin Role**: Full access to admin panel, all management features, plus student features
- **Student Role**: Access to workshop browsing, booking, and personal booking history only

## Additional Features

### Auto-Enrollment Tracking
- Workshops automatically update their "enrolled" count when new bookings are made
- Enrollment stats are visible in both admin and student views

### Role Toggle
- Admins can promote students to admin or demote admins to students
- Changes take effect immediately

### Responsive Design
- Admin panel works seamlessly on desktop, tablet, and mobile devices
- Touch-friendly interface with mobile-optimized navigation

## Technical Notes

- Admin user is automatically created on first app load
- All data is persisted in MongoDB through the backend API
- Real-time updates across all admin pages
- Glassmorphism UI with smooth animations
- Full CRUD operations on workshops, users, and bookings

## Demo Features

- Pre-populated with 8 sample workshops
- Sample student accounts can be created through registration
- All admin operations are fully functional
- Payment processing is simulated (no real transactions)

---

**Note:** This is a demonstration admin panel. In a production environment, you would implement:
- Password hashing and security
- Email verification
- Two-factor authentication
- Audit logs
- More granular permissions
- Real payment integration
