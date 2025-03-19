# Real-Time Chat Application

This is a full-stack real-time chat application built with React, Express, MongoDB, and Socket.io. It includes features such as user authentication, direct messaging, group chat, and real-time message updates.

## Features

- **User Authentication**: Signup, Login, Logout
- **Profile Management**: Update profile, add/remove profile images
- **Direct Messaging**: Chat with contacts in real-time
- **Group Chat**: Create and manage chat channels
- **Real-Time Messaging**: Implemented with WebSockets (Socket.io)
- **Search Contacts**: Find users easily
- **Secure API**: JWT authentication for user sessions

## Tech Stack

### Client-Side (Frontend)

- **React.js** - Frontend framework
- **Zustand** - State management
- **React Router** - Navigation
- **Socket.io-client** - Real-time communication
- **Axios** - HTTP requests
- **Tailwind CSS** - Styling
- **Sonner** - Notifications

### Server-Side (Backend)

- **Express.js** - Backend framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time messaging
- **JWT (JSON Web Token)** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File uploads

## Installation

### Prerequisites

- Node.js and npm installed
- MongoDB database running locally or on a cloud service

### Setup

#### 1. Clone the Repository

```sh
git clone https://github.com/your-repo/chat-app.git
cd chat-app
```

#### 2. Install Dependencies

##### Client-Side

```sh
cd client
npm install
```

##### Server-Side

```sh
cd server
npm install
```

#### 3. Configure Environment Variables

Create a `.env` file in the `server/` directory and add:

```env
PORT=8080
JWT_KEY="your_secret_key"
ORIGIN="http://localhost:5173"
DATABASE_URL="mongodb://127.0.0.1:27017/RealTime-Chat-App"
```

#### 4. Start the Application

##### Start Backend Server

```sh
cd server
npm run dev
```

##### Start Frontend Server

```sh
cd client
npm run dev
```

## Project Structure

```
📂 chat-app
 ├── 📂 client (Frontend)
 │   ├── 📂 components
 │   ├── 📂 context
 │   ├── 📂 pages
 │   ├── 📂 slices
 │   ├── 📂 store
 │   ├── 📂 utils
 │   ├── App.jsx
 │   ├── main.jsx
 │   ├── index.css
 │
 ├── 📂 server (Backend)
 │   ├── 📂 controllers
 │   ├── 📂 middlewares
 │   ├── 📂 models
 │   ├── 📂 routes
 │   ├── index.js
 │   ├── socket.js
 │   ├── .env
 │
 ├── package.json
 ├── README.md
```

## API Endpoints

### Authentication Routes

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/user-info` - Fetch user profile
- `POST /api/auth/update-profile` - Update profile
- `POST /api/auth/add-profile-image` - Upload profile image
- `DELETE /api/auth/remove-profile-image` - Remove profile image
- `POST /api/auth/logout` - User logout

### Contacts Routes

- `POST /api/contacts/search` - Search users
- `POST /api/contacts/get-contacts-for-dm` - Fetch DM contacts
- `POST /api/contacts/get/all-contact` - Fetch all contacts

### Messaging Routes

- `POST /api/messages/get-messages` - Get messages for DM or channels

### Channel Routes

- `POST /api/channel/create-channel` - Create a new chat channel
- `POST /api/channel/get-user-channels` - Fetch user’s channels

## Usage Guide

1. Sign up or log in.
2. Set up your profile (add name, picture, and color theme).
3. Start chatting with contacts or create a channel.
4. Receive messages in real-time.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Contributors

- Your Name - [GitHub](https://github.com/your-profile)

## Acknowledgments

- Inspired by modern chat applications like Slack and Discord.
