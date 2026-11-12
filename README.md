# Coursera - Course Selling Platform

A full-stack web application for purchasing and managing online courses. Built with **React, Vite, Material UI** on the frontend, and a **Node.js / Express-compatible REST API** with JWT authentication on the backend.

---

## Features

* **Authentication & Role-Based Access:**
  * Separate flows for **Instructors (Admin)** and **Students (Users)**.
  * Stateless JWT authentication with Bearer tokens stored in localStorage.
* **Course Browsing & Catalog:**
  * Clean Material UI grid displaying all published courses with pricing, thumbnails, and descriptions.
  * Direct enrollment workflow for students.
* **Course Management:**
  * Dedicated course creation panel for instructors.
  * Real-time course editing screen with side-by-side live card preview.
* **Zero-Setup Backend:**
  * Built-in HTTP REST API running on port 3000 with CORS and pre-seeded sample courses.

---

## Project Structure

```
course-selling-app/
├── server/
│   └── index.js             # Backend REST API server (Port 3000)
├── src/
│   ├── assets/              # Static SVG and icons
│   ├── AddCourse.jsx        # Course creation form
│   ├── App.css              # App styling
│   ├── App.jsx              # React Router v6 routing configuration
│   ├── Appbar.jsx           # Top navigation bar with dynamic auth status
│   ├── Course.jsx           # Course editor & live preview panel
│   ├── Courses.jsx          # Course catalog grid
│   ├── Landing.jsx          # Landing hero page
│   ├── main.jsx             # React entrypoint
│   ├── Signin.jsx           # Login page
│   └── Signup.jsx           # Registration page
├── index.html               # Vite HTML entrypoint
├── package.json             # Scripts and dependencies
└── vite.config.js           # Vite configuration
```

---

## API Endpoints

### Admin (Instructor)
* `POST /admin/signup` - Register a new instructor account
* `POST /admin/login` - Authenticate instructor and return JWT token
* `GET /admin/me` - Get logged-in instructor profile
* `GET /admin/courses` - Fetch all courses
* `POST /admin/courses` - Create a new course
* `GET /admin/courses/:id` - Fetch single course by ID
* `PUT /admin/courses/:id` - Update existing course details

### User (Student)
* `POST /users/signup` - Register a new student account
* `POST /users/login` - Authenticate student and return JWT token
* `GET /users/me` - Get logged-in student profile
* `GET /users/courses` - Browse all published courses
* `POST /users/courses/:id` - Purchase/enroll in a course
* `GET /users/purchasedCourses` - View list of enrolled courses

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Backend Server
```bash
npm run server
```
The backend server runs on `http://localhost:3000`.

### 3. Start the Frontend Application
In a separate terminal:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Default Accounts for Testing

* **Admin:** `admin@coursera.com` / `password123`
* **Student:** `student@coursera.com` / `password123`
