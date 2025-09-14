# Twitter Post Scheduler & Analytics Dashboard

A modern, responsive **Twitter Dashboard** built with the **MERN stack (MongoDB, Express, React, Node.js)**. This app allows users to **create, schedule, and analyze tweets** with **AI-powered content suggestions**, **smart scheduling**, and a real-time **analytics dashboard**.

---

## Features

- **Content Management**  
  - Create, edit, and schedule tweets  
  - 280-character validation  
  - Upload images and videos  
  - Real-time status updates for posts  

- **AI Content Suggestions**  
  - Generate tweet ideas based on trending topics  
  - Hashtag recommendations  
  - Insert suggestions directly into the composer  

- **Smart Scheduling**  
  - AI-generated optimal posting times  
  - Time zone handling for international scheduling  
  - Conflict detection for overlapping posts  

- **Analytics Dashboard**  
  - Track tweet engagement: Viral, Performing, Underperforming  
  - Visualize engagement with charts and badges  
  - Real-time analytics updates  

- **Authentication & Security**  
  - JWT-based authentication (OAuth optional)  
  - Secure session management  
  - Passwords stored using hashing  

- **Responsive UI**  
  - React.js with hooks and TypeScript  
  - Stateless, reusable components  
  - Global state management via Zustand  
  - Material UI + Chakra UI styling  

---

## Technologies Used

- **Frontend:** React.js, TypeScript, Material UI, Chakra UI, Zustand  
- **Backend:** Node.js, Express.js, TypeScript  
- **Database:** MongoDB  
- **Authentication:** JWT  
- **Charts:** Recharts for analytics  
- **Real-time Updates:** Optional WebSockets or polling  

---

## Project Structure

/client # React frontend
/components
/pages
/services
/store # Zustand store
/server # Express backend
/controllers
/models # Mongoose schemas
/routes
/middlewares


---

## Getting Started

### Prerequisites

- Node.js >= 18  
- MongoDB (local or cloud)  
- npm or yarn

- ### Installation & Running the App


API Documentation
Authentication

Handles user registration and login with JWT-based security.
| Method | Endpoint         | Description                                    |
| ------ | ---------------- | ---------------------------------------------- |
| POST   | `/auth/register` | Register a new user and receive a JWT token    |
| POST   | `/auth/login`    | Login with credentials and receive a JWT token |

Tweets

Handles CRUD operations for tweets, including scheduling and posting.
| Method | Endpoint           | Description                                |
| ------ | ------------------ | ------------------------------------------ |
| GET    | `/tweets`          | Get all tweets for the authenticated user  |
| POST   | `/tweets`          | Create a new tweet (supports media upload) |
| PUT    | `/tweets/:id`      | Update an existing tweet                   |
| DELETE | `/tweets/:id`      | Delete a scheduled tweet                   |
| POST   | `/tweets/:id/post` | Post a scheduled tweet immediately         |

AI Suggestions

Provides AI-powered tweet ideas and recommended posting times.
| Method | Endpoint                        | Description                                      |
| ------ | ------------------------------- | ------------------------------------------------ |
| GET    | `/ai/suggestions?topic=<topic>` | Returns AI-generated tweet ideas for a topic     |
| GET    | `/ai/suggestTime?topic=<topic>` | Returns AI-recommended posting times for a topic |



Key Points

All /tweets and /ai routes require a valid JWT in the Authorization header:
Authorization: Bearer <token>

Full TypeScript support on frontend and backend.

Loading states and error handling implemented across all routes.

Real-time updates can be integrated for posting status and analytics.




