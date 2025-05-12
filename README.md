# 🌐 PersonaScape

A full-stack web application that lets users create **customizable, shareable profile pages** with interactive social features.

---

## 🚀 Features

✅ **User Authentication** (Sign up & log in with hashed passwords)
✅ **Shareable Profile Pages** (Unique URL per user)
✅ **Profile Customization** (Bio, hobbies, social links)
✅ **Profile Pictures** (Upload and display user avatars)
✅ **Background Images** (Personalize your profile with custom backgrounds)
✅ **Theme Selector** (Choose from multiple theme options: Default, Dark, Minimal, Colorful)  
✅ **Markdown Support** (Format your bio with Markdown, including GFM)
✅ **Like/Rating System** (Like other users' profiles)
✅ **Leaderboard** (View most popular profiles) 
✅ **Authorization** (Only the owner can edit their page)
✅ **Mobile-Friendly & Responsive Design** (Tailwind CSS)
✅ **Comment System** (Leave comments on profiles with nested replies and likes)
✅ **Custom HTML** (Advanced users can add custom HTML to their profiles)

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
| File Storage    | Local + ImgBB (profile pictures) |
| Markdown        | React-Markdown + remark-gfm |
| Deployment (FE) | Vercel                 |
| Deployment (BE) | Render                 |

---

## 📂 Project Structure

```
/PersonaScape
├── /backend
│    ├── prisma/
│    │    ├── schema.prisma  
│    │    └── migrations/
│    ├── src/
│    │    ├── index.js       # Main app entry
│    │    ├── routes/        # API endpoints
│    │    ├── controllers/   # Business logic
│    │    ├── middleware/    # Auth, upload handlers
│    │    └── prismaClient.js
│    ├── public/uploads/     # Background image storage
│    ├── .env
│    └── package.json
├── /frontend
│    ├── src/
│    │    ├── app/           # Next.js 14 app router
│    │    ├── components/    # Shared UI components
│    │    ├── context/       # Auth context
│    │    ├── hooks/         # Custom hooks
│    │    └── lib/           # Utils (API, image, theme)
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
| GET    | `/auth/me`     | Get current user info |

### 👤 Profile

| Method | Endpoint                     | Description                          |
| ------ | ---------------------------- | ------------------------------------ |
| GET    | `/profile/:username`         | Fetch public profile                 |
| PUT    | `/profile/`                  | Update own profile (auth required)   |
| POST   | `/profile/upload`            | Upload profile picture               |
| POST   | `/profile/upload-background` | Upload background image              |

### 👍 Likes

| Method | Endpoint                   | Description                           |
| ------ | -------------------------- | ------------------------------------- |
| POST   | `/likes/profile/:username` | Like/unlike a profile                 |
| GET    | `/likes/leaderboard`       | Get most liked profiles               |
| GET    | `/likes/user`              | Get profiles liked by current user    |
| GET    | `/likes/profile/:username` | Check if current user liked a profile |

### 💬 Comments

| Method | Endpoint                 | Description                                |
| ------ | ------------------------ | ------------------------------------------ |
| GET    | `/comments/profile/:id`  | Get comments for a profile (paginated)     |
| POST   | `/comments`              | Create a new comment/reply (auth required) |
| PUT    | `/comments/:id`          | Update a comment (auth required)           |
| DELETE | `/comments/:id`          | Delete a comment (auth required)           |
| POST   | `/comments/:id/like`     | Like/unlike a comment (auth required)      |

---

## 🔧 Setup

### 1️⃣ Clone the repo

```bash
git clone https://github.com/yourusername/PersonaScape.git
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
* Configure environment variables:
  * `NEXT_PUBLIC_API_URL`: Your backend URL
  * `NEXT_PUBLIC_IMGBB_API_KEY`: For profile image uploads (optional)

### Backend (Render)

* Import repo in Render dashboard
* Set root directory: `/backend`
* Build Command: `npm install`
* Start Command: `node src/index.js`
* Add environment variables (see `.env` above)
* Add a persistent disk for uploads

---

## 🔑 Auth Flow

* JWT-based authentication system
* Tokens stored in HTTP-only cookies and localStorage (fallback)
* Protected routes require valid authentication
* User permissions based on profile ownership

---

## ✅ Future Features

* Enhanced analytics (time-based engagement metrics)
* User following/connections system
* Activity feed of liked/commented profiles
* Social media authentication (OAuth)
* Email verification
* Password reset functionality
* Admin dashboard
* Dark/light mode toggle
* Comprehensive test coverage

---

## �� License

MIT

---