# 🌐 PersonaScape

A full-stack web application that lets users create **customizable, shareable profile pages** with interactive social features.

---

## 🚀 Features

✅ **User Authentication** (Sign up & log in with hashed passwords)
✅ **Shareable Profile Pages** (Unique URL per user)
✅ **Profile Customization** (Bio, hobbies, social links, themes)
✅ **Profile Pictures** (Upload and display user avatars)
✅ **Like/Rating System** (Like other users' profiles)
✅ **Leaderboard** (View most popular profiles) 
✅ **Authorization** (Only the owner can edit their page)
✅ **Mobile-Friendly & Responsive Design** (Tailwind CSS)
✅ **Comment System** (Leave comments on profiles with nested replies)

---

## 🛠 Tech Stack

| **Component**   | **Tech**               |
| --------------- | ---------------------- |
| Frontend        | Next.js 14 + Tailwind CSS |
| HTTP Client     | Axios                  |
| Backend         | Node.js + Express (JavaScript) |
| ORM             | Prisma                 |
| Database        | PostgreSQL             |
| Auth            | JWT + bcrypt           |
| File Storage    | Local/Cloud Storage    |
| Deployment (FE) | Vercel (free plan)     |
| Deployment (BE) | Render (free plan)     |

---

## 📂 Project Structure

```
/PersonaScape
├── /backend
│    ├── prisma/
│    ├── src/
│    │    ├── index.js
│    │    ├── routes/
│    │    ├── controllers/
│    │    └── middleware/
│    ├── .env
│    └── package.json
├── /frontend
│    ├── src/
│    │    ├── app/
│    │    ├── components/
│    │    ├── context/
│    │    ├── hooks/
│    │    └── lib/
│    ├── public/
│    └── tailwind.config.js
├── README.md
└── .gitignore
```

---

## 📝 Backend API Endpoints

### 🔐 Auth

| Method | Endpoint       | Description          |
| ------ | -------------- | -------------------- |
| POST   | `/auth/signup` | Register new user    |
| POST   | `/auth/login`  | Log in (returns JWT) |

### 👤 Profile

| Method | Endpoint             | Description                        |
| ------ | -------------------- | ---------------------------------- |
| GET    | `/profile/:username` | Fetch public profile               |
| PUT    | `/profile/`          | Update own profile (auth required) |
| POST   | `/profile/upload`    | Upload profile picture             |

### 👍 Likes

| Method | Endpoint                   | Description                           |
| ------ | -------------------------- | ------------------------------------- |
| POST   | `/likes/profile/:username` | Like/unlike a profile                 |
| GET    | `/likes/leaderboard`       | Get most liked profiles               |
| GET    | `/likes/profile/:username` | Check if current user liked a profile |

### 💬 Comments

| Method | Endpoint                 | Description                                |
| ------ | ------------------------ | ------------------------------------------ |
| GET    | `/comments/profile/:id`  | Get comments for a profile (paginated)     |
| GET    | `/comments/:id`          | Get a specific comment with replies        |
| POST   | `/comments`              | Create a new comment/reply (auth required) |
| PUT    | `/comments/:id`          | Update a comment (auth required)           |
| DELETE | `/comments/:id`          | Delete a comment (auth required)           |
| POST   | `/comments/:id/like`     | Like/unlike a comment (auth required)      |
| GET    | `/comments/:id/like`     | Check if user liked a comment             |

---

## 🔧 Setup

### 1️⃣ Clone the repo

```bash
git clone https://github.com/TheHillofSunflowers/PersonaScape.git
cd PersonaScape
```

### 2️⃣ Set up Backend

```bash
cd backend
npm install
npx prisma migrate dev --name init
```

Create `.env` in `/backend`:

```
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
```

Run:

```bash
npm run dev
```

### 3️⃣ Set up Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🌍 Deployment

### Frontend (Vercel)

* Import repo in Vercel dashboard
* Set root directory: `/frontend`
* Configure environment variables for API URL

### Backend (Render)

* Import repo in Render dashboard
* Set root directory: `/backend`
* Build Command: `npm install`
* Start Command: `node src/index.js`
* Add environment variables via the Render UI

---

## 🔑 Auth Flow

* JWT-based authentication system
* Tokens stored in HTTP-only cookies
* Protected routes require valid authentication
* User permissions based on profile ownership

---

## ✅ TODO / Future Features

* Enhanced analytics (views, engagement metrics)
* Profile templates/themes marketplace
* User following/connections system
* Activity feed of liked/commented profiles
* Dark mode support
* Social media authentication (OAuth)
* Email verification
* Password reset functionality
* Admin dashboard
* Profile content moderation
* Notifications system
* Search and filtering features
* Comprehensive test coverage

---

# 👨‍�� License

MIT

---