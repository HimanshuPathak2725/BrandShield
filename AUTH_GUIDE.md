# 🔐 BrandShield Authentication System

## Overview

The BrandShield application now includes a complete authentication system with user registration, login, session management, and user tracking.

---

## ✨ Features Implemented

### 1. **Authentication Flow**
- ✅ Login/Signup page shown on first visit
- ✅ Protected routes - users must be authenticated to access
- ✅ Session persistence across page reloads
- ✅ Automatic redirect to auth page if not logged in

### 2. **User Management**
- ✅ User registration with email, password, name, and company
- ✅ Secure login with credential validation
- ✅ User sessions stored server-side
- ✅ All user data saved to `users.json` file
- ✅ Track registration date and last login time

### 3. **UI Updates**
- ✅ Login/Signup button hidden when user is logged in
- ✅ User name displayed in header when authenticated
- ✅ Logout dropdown menu in header
- ✅ Error messages for failed authentication
- ✅ Loading states during authentication

### 4. **Admin Dashboard**
- ✅ View all registered users at `/admin`
- ✅ See total user count
- ✅ Track registration dates and last login times

---

## 🚀 How to Use

### For Users:

1. **First Visit**
   - Navigate to `http://localhost:3000`
   - You'll be redirected to the login/signup page

2. **Sign Up**
   - Click "Sign Up" tab
   - Enter your details:
     - Full Name
     - Work Email
     - Company (optional)
     - Password
     - Confirm Password
   - Agree to terms
   - Click "Create Account"

3. **Login**
   - Click "Login" tab
   - Enter email and password
   - Click "Sign In to Dashboard"

4. **Once Logged In**
   - Login/Signup button disappears from navbar
   - Your name appears in the header
   - Click your name to see logout option
   - Stay logged in across page reloads

5. **Logout**
   - Click your name in the header
   - Click "Logout" from dropdown

### For Admins:

**View All Users:**
- Navigate to `http://localhost:3000/admin`
- See complete list of registered users
- View registration and login statistics

---

## 🔌 API Endpoints

### Authentication Endpoints:

#### Register New User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "company": "Company Inc"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Logout
```
POST /api/auth/logout
```

#### Get Current User
```
GET /api/auth/me
```

#### Get All Users (Admin)
```
GET /api/auth/users
```

---

## 📁 User Data Storage

User data is stored in `users.json` in the project root:

```json
{
  "user@example.com": {
    "id": "uuid-here",
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "company": "Company Inc",
    "created_at": "2026-01-10T...",
    "last_login": "2026-01-10T..."
  }
}
```

**Location:** `c:\Users\DELL\brandshield\BrandShield\users.json`

---

## 🔒 Security Notes

### Current Implementation (Development):
- ⚠️ Passwords stored in plain text
- ⚠️ Simple session management
- ⚠️ No password strength validation
- ⚠️ No email verification

### Production Recommendations:
1. **Hash passwords** using bcrypt or similar
2. **Use proper database** (PostgreSQL, MongoDB, etc.)
3. **Implement JWT tokens** or secure session management
4. **Add password strength requirements**
5. **Enable email verification**
6. **Add rate limiting** to prevent brute force
7. **Use HTTPS** in production
8. **Add CSRF protection**
9. **Implement password reset** functionality
10. **Add two-factor authentication** (2FA)

---

## 🎯 Protected Routes

The following routes require authentication:
- `/` - Home page
- `/dashboard` - Dashboard
- `/insights` - Insights page
- `/trends` - Trends page
- `/results` - Results page

Public routes:
- `/auth` - Login/Signup page
- `/admin` - Admin dashboard

---

## 💡 Testing the System

### Test User Registration:
1. Go to `http://localhost:3000`
2. Click "Sign Up"
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Company: Test Corp
   - Password: test123
4. Submit and verify redirect to dashboard

### Test Login:
1. Logout if logged in
2. Go to `http://localhost:3000/auth`
3. Use credentials:
   - Email: test@example.com
   - Password: test123
4. Verify successful login

### Test Session Persistence:
1. Login to the app
2. Refresh the page
3. Verify you're still logged in
4. Navigate to different pages
5. Verify session persists

### View Registered Users:
1. Navigate to `http://localhost:3000/admin`
2. See all registered users
3. Check user count matches registrations

---

## 🐛 Troubleshooting

### "Failed to fetch" error:
- Ensure backend is running on port 5000
- Check: `http://localhost:5000/api/health`

### Not redirected to login page:
- Clear browser cache and cookies
- Check browser console for errors

### Login doesn't work:
- Verify credentials are correct
- Check backend terminal for error messages
- Ensure `users.json` is not corrupted

### Can't access protected routes:
- Make sure you're logged in
- Check cookies are enabled
- Verify session is active: `http://localhost:5000/api/auth/me`

---

## 📊 Monitoring Users

### View Total Users:
```bash
# Check health endpoint
curl http://localhost:5000/api/health
```

### View All User Details:
```bash
# Get all users
curl http://localhost:5000/api/auth/users
```

### Check users.json File:
```powershell
# View file contents
Get-Content c:\Users\DELL\brandshield\BrandShield\users.json | ConvertFrom-Json
```

---

## 🔄 Resetting User Data

To clear all users and start fresh:

```powershell
# Delete users.json file
Remove-Item c:\Users\DELL\brandshield\BrandShield\users.json
```

The file will be recreated automatically when a new user registers.

---

## ✅ Success!

Your authentication system is now fully functional! Users can:
- ✅ Register new accounts
- ✅ Login with credentials  
- ✅ Stay logged in across sessions
- ✅ Access protected content
- ✅ Logout when done

And you can:
- ✅ Track all registered users
- ✅ Monitor user activity
- ✅ View user statistics
- ✅ See login patterns

**Enjoy your secure BrandShield application!** 🛡️
