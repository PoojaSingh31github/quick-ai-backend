# 🧠 Quick AI - Backend

This is the backend server for **Quick AI**, a generative AI web application that offers multiple tools like article generation, image background removal, resume review, and more. Built using **Express.js**, it integrates with **OpenAI**, **Google Generative AI**, **Cloudinary**, and a **Neon PostgreSQL** database.

---

## 🚀 Tech Stack

- **Node.js** + **Express**
- **OpenAI API**
- **Clip-Drop** (Image genrating ai tool)
- **NeonDB** (PostgreSQL - serverless)
- **Cloudinary** (for image upload & manipulation)
- **Clerk** (authentication)
- **Multer** (file uploads)
- **pdf-parse** (PDF resume parsing)

---

## 📁 Project Structure
```
ai-backend/
│
├── .env # Environment variables
├── routes/ # Express routes
├── controllers/ # Logic handlers
├── utils/ # Helper functions
├── middleware/ # Auth and error handling
├── uploads
├── index.js # Entry point
```

## 🔐 Environment Variables (`.env`)

```
env
PORT=5000
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_google_ai_key
DATABASE_URL=your_neon_db_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
CLERK_SECRET_KEY=xxx

```
# Install dependencies
npm install

# Start dev server
npm run start
