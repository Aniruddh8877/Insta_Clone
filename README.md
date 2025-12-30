# 📸 Instagram Clone

A fully responsive full-stack social media application built with **Next.js**, **MongoDB**, and **Cloudinary**. This project replicates core Instagram features including posting photos/videos, liking, commenting, following users, and direct messaging.

## 🚀 Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Backend
- **Runtime**: Next.js API Routes (Serverless)
- **Database**: [MongoDB](https://www.mongodb.com/) (Atlas)
- **ORM**: [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT (JSON Web Tokens) & BCrypt (Password Hashing)

### Cloud Services
- **Storage**: [Cloudinary](https://cloudinary.com/) (Image & Video uploads)

---

## ✨ Features

- **Authentication**: Secure Login, Register, and Logout (HTTP-only cookies).
- **Create Posts**: Upload multiple images and videos with preview and carousel view.
- **Feed**: Scroll through posts continuously.
- **Interactions**: Like posts and add comments.
- **Profile**: View user profiles, posts, followers, and following counts.
- **Follow System**: Follow/Unfollow users.
- **Direct Messaging**: Chat with other users.
- **Responsive Design**: Optimized layouts for Mobile, Tablet, and Desktop.

---

## 📂 Folder Structure

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # Backend API Routes
│   │   ├── auth/         # Login/Register/Me endpoints
│   │   ├── posts/        # Post CRUD & Likes/Comments
│   │   ├── users/        # User Profile & Follow
│   │   └── messages/     # DM functionality
│   ├── create/           # Create Post Page
│   ├── login/            # Login Page
│   ├── register/         # Sign Up Page
│   ├── messages/         # Direct Messages UI
│   ├── p/[id]/           # Single Post View
│   ├── u/[username]/     # Public Profile Page
│   ├── layout.tsx        # Root Layout (inc. Navbar)
│   └── page.tsx          # Home Feed
├── components/           # Reusable UI Components
│   ├── Navbar.tsx        # Responsive Navigation
│   └── PostCard.tsx      # Post Display & Interactions
└── lib/                  # Utilities & Configuration
    ├── db.ts             # MongoDB Connection
    ├── utils.ts          # Helper functions (Time formatter)
    └── models/           # Mongoose Schemas (User, Post, Message)
```

---

## 📦 Dependencies

Major packages used in this project:

```json
"dependencies": {
  "next": "16.1.1",
  "react": "19.2.3",
  "mongoose": "^9.0.2",
  "cloudinary": "^2.8.0",
  "bcryptjs": "^3.0.3",
  "jsonwebtoken": "^9.0.3",
  "react-icons": "^5.5.0",
  "framer-motion": "^12.23.26"
}
```

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone <repository_url>
cd instagram-clone
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following:

```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/instagram-clone

# Security
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary (Media Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📝 License

This project is for educational purposes.
