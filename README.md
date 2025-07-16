# Tubbit 🎥

Tubbit is a modern, full-stack video-sharing platform inspired by **YouTube** and **Twitter**. Built with the **MERN stack**, **Tailwind CSS**, and **Radix UI**, Tubbit lets users upload, watch, and engage with video content in a sleek, responsive interface.

## 🚀 Features

- 🔐 User authentication with JWT and bcrypt
- ✉️ Email OTP verification using Redis and Nodemailer
- 📹 Video upload and streaming via Cloudinary
- 🧵 Threaded comments and replies
- ❤️ Like, subscription functionality
- 🔍 Search and filter videos by tags
- 🧠 State management with Redux Toolkit
- 🎨 Beautiful UI with Tailwind CSS, ShadCN, and Radix UI
- ⚡ Fast client-side routing with React Router and Vite
- 🛡️ Rate limiting and secure API practices

## 🛠️ Tech Stack

| Frontend        | Backend         | Database | Dev Tools & Libraries |
|----------------|-----------------|----------|------------------------|
| React + Vite   | Node.js + Express | MongoDB  | Redux Toolkit, Axios, Cloudinary, Multer, Cookie-Parser, React Hook Form, Redis, Nodemailer, Lucide Icons, Express-Rate-Limit and more... |

## 📦 Installation

### Prerequisites

- Node.js
- Express.js
- React.js
- MongoDB
- Redis (for OTP storage)
- Cloudinary (for asset uploads)

### Clone the repo

```bash
git clone https://github.com/iamsubhajit23/Tubbit.git
cd Tubbit
```

### Setup Server

```bash
cd server
npm install

# Create a .env file with following variables:
# PORT = 
# DATABASE_URI = 
# CORS_ORIGIN =
# ACCESS_TOKEN_SECRET =
# ACCESS_TOKEN_EXPIRY =
# REFRESH_TOKEN_SECRET =
# REFRESH_TOKEN_EXPIRY = 
# CLOUDINARY_CLOUD_NAME = 
# CLOUDINARY_API_KEY = 
# CLOUDINARY_API_KEY_SECRET = 
# MAIL_PORT = 
# MAIL_HOST = 
# MAIL_USER =
# MAIL_PASS = 
# MAIL_FROM =
# REDIS_HOST = 
# REDIS_PORT =
# REDIS_PASS =

npm run dev
```

### Setup Client

```bash
cd client
npm install
npm run dev
```

### 🌐 Live 

Check out the live version at: [tubbit.vercel.app](https://tubbit.vercel.app/)


### 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.


Built with ❤️ by [Subhajit Dash](https://www.linkedin.com/in/subhajitdash/)
