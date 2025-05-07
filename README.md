# 🌐 PersonaScape

A full-stack web application that lets users create **customizable, shareable profile pages**.

---

## 🚀 Features

✅ **User Authentication** (Sign up & log in with hashed passwords)
✅ **Shareable Profile Pages** (Unique URL per user)
✅ **Profile Customization** (Bio, hobbies, social links, themes, custom HTML)
✅ **Authorization** (Only the owner can edit their page)
✅ **Mobile-Friendly & Responsive Design** (Tailwind CSS)

---

## 🛠 Tech Stack

| **Component**   | **Tech**               |
| --------------- | ---------------------- |
| Frontend        | Next.js + Tailwind CSS |
| HTTP Client     | Axios                  |
| Backend         | Node.js + Express      |
| ORM             | Prisma                 |
| Database        | PostgreSQL             |
| Auth            | JWT + bcrypt           |
| Deployment (FE) | Vercel (free plan)     |
| Deployment (BE) | Render (free plan)     |

---

## 📂 Monorepo Structure

```
/profile-builder
├── /backend
│    ├── prisma/
│    ├── src/
│    │    ├── index.js
│    │    ├── routes/
│    │    └── controllers/
│    ├── .env
│    └── package.json
├── /frontend
│    ├── pages/
│    ├── components/
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
```

Run:

```bash
npx nodemon src/index.js
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
* No build command needed (Next.js auto-detects)

### Backend (Render)

* Import repo in Render dashboard
* Set root directory: `/backend`
* Build Command: `npm install`
* Start Command: `node src/index.js`
* Add environment variables via the Render UI

---

## 🔑 Auth Flow (Frontend)

* Axios sends JWT in `Authorization: Bearer <token>` header
* Protected pages (edit profile) require login
* Public pages (profile URLs) are accessible by anyone

---

## ✅ TODO / Extras

* Profile picture uploads
* View count analytics
* Theme editor WYSIWYG
* Better error handling & validation

---

# 👨‍💻 License

MIT

---