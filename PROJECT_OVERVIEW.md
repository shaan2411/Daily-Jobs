# 🏗️ Daily Jobs - Professional Project Overview

**Daily Jobs** is a modern, full-stack web application designed to empower local communities by bridging the gap between daily wage seekers and neighborhood employers. Built with accessibility and speed in mind, it provides a seamless interface for finding verified work or hiring skilled talent in minutes.

---

## 🌟 Key Features

### 1. 📍 Precision Location Discovery (New!)

- **Geospatial Search**: Integrated MongoDB `2dsphere` indexing to find jobs based on real-time GPS coordinates or specific city names.
- **Radius Filtering**: Users can filter opportunities within walking distance (5km to 500km).
- **Proximity Badging**: Every job card dynamically displays the exact distance (km) from your current location.

### 2. 🚀 Interactive Onboarding (New!)

- **Anti-Gravity Guided Tour**: A premium, interactive Intro.js walkthrough that "floats" over key UI elements (Sidebar, Search, Listings, Apply button).
- **Role-Based Experience**: Tailored onboarding for both Job Seekers and Employers.
- **Persistent Progress**: Automatically starts on first visit using `localStorage` logic.

### 3. 📚 Visual App Tour (New!)

- **Process Walkthrough**: A high-impact, visual step-by-step guide on the homepage explaining how the platform works for each user role.
- **Zero-Friction Design**: Simplified card-based layout for quick scannability.

### 4. 👷 Secure Recruitment

- **Role-Based Access**: Specialized dashboards for Seekers (Job browsing) and Employers (Candidate management).
- **Verification Layer**: Registration requires ID proof upload to ensure a safe community environment.
- **Direct Communication**: Employers can see applicant details and contact them immediately to start the job.

---

## 🛠️ Technology Stack

| Layer          | Technology                                                                 |
|----------------|----------------------------------------------------------------------------|
| **Frontend**   | **React.js** (Modern SPA) & **Vanilla JS** (Progressive enhancement)       |
| **Styling**    | **CSS3** (Custom Modern Layouts), **Lucide Icons** (Premium SVG icons)     |
| **Onboarding** | **Intro.js** with Custom "Anti-Gravity" CSS Animations                     |
| **Backend**    | **Node.js** & **Express.js** (Robust RESTful API)                          |
| **Database**   | **MongoDB** (Mongoose ODM) with **Geospatial Querying**                    |
| **Auth**       | **JWT** (JSON Web Tokens) & **bcrypt** (Secure Hashing)                    |
| **Location**   | **Nominatim API** (Forward/Reverse Geocoding)                              |

---

## 🏗️ System Architecture

1. **Client-Side (React)**: A highly interactive Single Page Application (SPA) providing a fast, app-like experience for dashboarding and job management.
2. **Client-Side (Vanilla)**: Optimized static pages for high-speed initial loading and SEO.
3. **Server-Side (Express)**: Handles secure business logic, user authentication, notification events, and geospatial calculations.
4. **Database Layer (MongoDB)**: Efficient storage of users, jobs, and applications with specialized `2dsphere` indexes for proximity matching.

---

## 🚦 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (Running on `localhost:27017`)

### Installation & Run

1. **Install Dependencies**:

   ```bash
   npm install
   cd frontend && npm install
   ```

2. **Start Services** (Root folder):

   ```bash
   node server.js
   ```

3. **Start React Interface**:

   ```bash
   cd frontend && npm run dev
   ```

4. **Access the Platform**:

   - React Portal: `http://localhost:5173`
   - Vanilla Portal: `http://localhost:3000`

---

## 🎓 Conclusion

**Daily Jobs** successfully transitions a traditionally analog and inefficient job-finding process into a decentralized digital platform. By emphasizing **local proximity**, **visual guidance**, and **user trust**, it serves as a robust case study for solving socio-economic challenges with modern software engineering practices.
