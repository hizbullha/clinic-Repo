# Clinic Appointment System

 # Description
A full-stack clinic appointment management system that allows doctors and staff to manage appointments and patient records with persistent storage.

---

# Tech Stack
- Frontend: React
- Backend: Node.js + Express
- Database: PostgreSQL (choose yours)

---

# How to Run

#1. Clone repository
git clone https://github.com/hizbullha/clinic-Repo

# 2. Install dependencies

Backend:
cd backend
npm install

Frontend:
cd frontend
npm install

### 3. Run backend
npm run dev

### 4. Run frontend
npm run dev

### Admin Login ########
For the admin privileges, make sure to manually seed the admin role and credentials into the database

INSERT INTO users (username, password_hash, name, role)
VALUES (
  'admin',
  '$2a$10$YOUR_HASHED_PASSWORD_HERE',
  'System Administrator',
  'ADMIN'
);
Use the above provided method to put in SQL query into database for admin and use the hashed password for it.
---

## Features
- Create / Read / Update / Delete appointments
- Persistent database storage
- Doctor onboarding system
- Role-based access (if applicable)

---

## Notes
Make sure backend is running before frontend.
