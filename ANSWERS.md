########Q1. HOW TO RUN##############

Run backend using:
npm run dev

Run frontend using:
npm start

Ensure environment variables are set in .env file before starting backend.

##########Q2. STACK CHOICE########

I chose a PERN-style stack (PostgreSQL + Express + React + Node.js) because it provides a clean, scalable, and efficient way to build full-stack applications with persistent storage and a clear separation between frontend and backend.

React is suitable for building dynamic user interfaces such as clinic dashboards, appointment booking forms, and role-based views.

Node.js + Express provides a lightweight and flexible backend for building REST APIs to handle authentication, CRUD operations, and business logic.

PostgreSQL was chosen as the database because it provides strong data consistency, relational structure, and reliability for storing users, doctors, and appointment records.

A worse choice would have been using a heavy enterprise framework like Java Spring Boot for this task, as it would slow down development and introduce unnecessary complexity for a small persistent mini-app.

#########Q3. Edge case#########
One edge case handled is preventing appointment creation when required fields are empty or invalid.

If validation was not present, empty or malformed appointment entries would be sent to the backend, causing inconsistent or broken data in the database.

#########Q4.AI Usage#########

I used AI (ChatGPT) for:
- Debugging API request errors in appointment creation
- Refactoring React form components
- Cleaning unused features (profile image removal)

- #######Q5. HONEST GAP###########
- One weakness in my submission is limited input validation and error handling in some frontend forms.

Given more time, I would improve this by adding schema-based validation (e.g. Zod or Joi) and more robust backend validation to prevent invalid data from being stored.
