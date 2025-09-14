Twitter Post Scheduler & Analytics Dashboard

A modern MERN stack tool to schedule, manage, and analyze tweets with AI-powered content suggestions, smart scheduling, and an analytics dashboard.

Features
1. Content Management

Create, edit, and schedule tweets.

Character validation (280-character limit).

Support for media uploads (images, videos).

Real-time update of posting status.

2. AI Content Suggestions

Generate tweet ideas based on trending topics.

Hashtag recommendations based on content analysis.

Insert AI-generated suggestions directly into the tweet composer.

3. Smart Scheduling

Optimal posting time suggestions using AI analysis.

Time zone handling for international scheduling.

Conflict detection to avoid overlapping posts.

4. Analytics Dashboard

Track post-performance with engagement metrics:

Viral: High engagement

Performing: Moderate engagement

Underperforming: Low engagement

Visualize engagement using pie charts and summary badges.

Real-time updates for analytics.

5. Authentication & Security

Secure user authentication using JWT (OAuth optional for future enhancement).

Proper session management and route protection.

Passwords stored securely using hashing.

6. Responsive UI

Built using React.js with modern hooks and patterns.

Reusable stateless components.

Global state management via Zustand.

Components include:

Tweet Composer

Scheduled Tweets List

AI Content Suggestions

Analytics Dashboard (with charts)

Material UI + Chakra UI for polished and responsive styling.

Tech Stack

Frontend: React.js, TypeScript, Material UI, Chakra UI, Zustand

Backend: Node.js, Express.js, TypeScript

Database: MongoDB (with proper schema design for tweets, users, and analytics)

Authentication: JWT (JSON Web Tokens)

Real-time Updates: Optional WebSockets or polling for post status

Charts: Recharts for analytics visualizations

Project Structure
/client      # React frontend
  /components
  /pages
  /services
  /store      # Zustand store
/server      # Express backend
  /controllers
  /models    # Mongoose schemas
  /routes
  /middlewares

Setup Instructions
Prerequisites

Node.js >= 18

MongoDB (local or cloud instance)

npm or yarn

Backend Setup
cd server
npm install
cp .env.example .env
# Set MONGO_URI and JWT_SECRET
npm run dev

Frontend Setup
cd client
npm install
cp .env.example .env
# Set VITE_API_BASE to backend URL
npm run dev

Running the App

Backend: http://localhost:5000

Frontend: http://localhost:5173 (Vite default)

API Documentation
Authentication
Method	Endpoint	Description
POST	/auth/register	Register a new user
POST	/auth/login	Login and receive JWT
Tweets
Method	Endpoint	Description
GET	/tweets	Get all tweets for authenticated user
POST	/tweets	Create a new tweet
DELETE	/tweets/:id	Delete a scheduled tweet
AI Suggestions
Method	Endpoint	Description
GET	/ai/suggestions?topic=<topic>	Get AI-generated tweet ideas
GET	/ai/suggestTime?topic=<topic>	Get suggested posting times
Key Considerations

Full TypeScript support on both frontend and backend.

JWT-secured API endpoints.

Loading states and error handling across all components.

Mobile-first, responsive UI design.

Real-time analytics updates with dummy or actual engagement metrics.

