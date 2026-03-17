# Daily Jobs

## Title
Daily Jobs

## Abstract
This project Daily Jobs is a web based application developed to help unemployed and uneducated people find daily wage jobs easily. The system allows job seekers to search jobs near their location and employers to post job vacancies. The application provides login, registration, job posting, job searching, and profile management features. The project is developed using HTML, CSS, JavaScript, Node.js, Express, and MongoDB.

## Introduction
In many developing countries, uneducated and unskilled laborers face significant challenges in finding daily wage jobs. Traditional methods often rely on word-of-mouth or physically visiting labor squares, which is inefficient and uncertain. Daily Jobs aims to bridge this gap by providing a simple, localized web platform where individuals can connect directly with people in their neighborhood who need temporary help for tasks like construction, household chores, unloading, cleaning, etc.

## Objective
The main objective of this project is to create an accessible application that:
- Connects local daily wage workers directly with employers without middlemen.
- Provides a simple interface for uneducated or semi-educated individuals to easily find jobs based on location.
- Allows employers to quickly hire temporary workers for personal or commercial needs.
- Ensures a layer of trust by collecting ID proofs during registration.

## Technology Used
- **Frontend**: HTML5, CSS3 (Custom Responsive Layout), Vanilla JavaScript (DOM Manipulation & Fetch API)
- **Backend Environment**: Node.js
- **Web Framework**: Express.js
- **Database**: MongoDB (Mongoose ODMS)
- **Authentication**: bcrypt for password hashing, express-session for session management
- **File Uploads**: multer for address proof securely stored in the local server folder.

## System Architecture
The application follows a standard Client-Server architecture:
1. **Client Layer**: The browser renders the HTML, CSS, and JS static files served from the Express `public` folder. Using Fetch API, it communicates with the server via RESTful endpoints.
2. **Server Layer**: The Express framework intercepts HTTP requests, routes them to specific controllers, processes logical rules (e.g. checking credentials, hashing passwords), and generates responses.
3. **Data Layer**: Mongoose schemas map to MongoDB collections to manage users, job postings, and job applications securely. Uploaded files (like ID proofs) are stored in the server's filesystem.

## Modules
1. **Authentication Module**
   - User Registration (Job Seeker / Employer) with ID proof upload.
   - User Login with Role-based redirection (Seekers to Jobs list, Employers to Dashboard).
   - Session Management and Logout.
2. **Job Management Module (Employer)**
   - Post a new Job with location, title, and daily wage info.
   - Dashboard to view posted jobs and check applied seekers' details.
3. **Job Search Module (Job Seeker)**
   - Browse all open daily wage jobs.
   - Filter jobs locally based on area or location matching.
   - View contact numbers directly (or upon applying) depending on requirements.
4. **Application Module**
   - Apply for jobs.
   - Track application status.
5. **Profile Module**
   - View user-specific information, role, and uploaded data.

## Conclusion
The Daily Jobs web application successfully provides a digital solution to a traditional, analog problem in society. By keeping the design robust, simplistic, and fast, it reduces the friction involved in discovering localized, short-notice daily wage jobs. It is built using modern scalable technologies, opening avenues for future upgrades such as an integrated SMS alert system or mobile responsive progressive web application (PWA) formats.
