# 💬 ChatHive – Group Chat Application

A full-featured **group chat application** backend built with **Node.js**, **Express**, **MySQL**, and **Sequelize ORM**, featuring secure **JWT authentication**, **real-time messaging (Socket.io ready)**, and robust **group management** (admins, members, messages).

---

## 🚀 Features

- 🔐 User Registration & Login (with hashed passwords)
- ✅ JWT-based Authentication Middleware
- 👥 Group Creation with Admin Role
- ➕ Add/Remove Members by Admin
- 🧑‍🤝‍🧑 Join/Leave Groups (with single-admin guard)
- 📩 Group Chat Messaging
- 🗃️ View All Groups & Messages
- ⚙️ Socket Middleware for Real-Time Messaging Support

---

## 🛠️ Tech Stack

| Layer        | Tech                     |
|--------------|--------------------------|
| Backend      | Node.js, Express         |
| DB           | MySQL, Sequelize ORM     |
| Auth         | JWT, bcryptjs            |
| Realtime     | Socket.io (middleware ready) |
| Dev Tools    | Nodemon, dotenv          |

---

## 📁 Project Structure
```
group-chat-app/
│
├── config/
│ └── db.js # Sequelize DB config
│
├── controller/
│ ├── group_controller.js # All group management logic
│ └── user_controller.js # Auth: Signup & Login
│
├── middleware/
│ ├── auth.js # Express middleware for JWT
│ └── socketAuth.js # Socket.io auth middleware
│
├── model/
│ ├── index.js # Sequelize associations
│ ├── user_model.js
│ ├── group_model.js
│ ├── message_model.js
│ └── group_member_model.js
│
├── routes/
│ └── user_routes.js # Auth routes
├──View #Frontend
│
├── .env # Environment variables
├── package.json
└── server.js # App entry point
```
## 🔐 Environment Variables

Create a `.env` file at the root:

```
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
JWT_SECRET=your_secret_key
```

# Install dependencies
```npm install```

# Run the app (dev)
```npm run dev```