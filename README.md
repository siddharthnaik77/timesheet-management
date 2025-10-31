# Timesheet Management

A simple and efficient **Timesheet Management** system built with **Next.js** to store and manage daily task details.  
This app allows users to log in, view weekly task summaries, and add or edit their daily work entries.

---

##  Project Overview

The Timesheet Management system helps users maintain a structured record of their daily work.  
It supports session-based authentication, enabling personalized task tracking for each logged-in user.

---

## Features

- **User Login** – Secure authentication with session-based data storage  
- **Weeks Listing** – View tasks grouped by week  
- **Days & Task Listing** – See daily breakdown of work done within a week  
- **Add / Edit Task** – Create or update your daily task entries  
- **Session Handling** – Ensures user-specific data access and secure task tracking  

---

## Tech Stack

- **Framework:** Next.js  
- **Language:** TypeScript / JavaScript  
- **UI Library:** Ant Design (if used)  
- **Authentication:** NextAuth.js  
- **Styling:** Tailwind CSS or CSS Modules (based on your setup)  

---

## Login Credential
    
    email : admin@example.com
    password : password123

##  Environment Variables

Create a `.env.local` file in the project root and add the following:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=supersecretkey123

# 1️ Clone the repository
git clone https://github.com/siddharthnaik77/timesheet-management.git

# 2️ Navigate to the project folder
cd timesheet-management

# 3️ Install dependencies
npm install

# 4️ Start the development server
npm run dev

