// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { requireAuth, ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { neon } from '@neondatabase/serverless';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const sql = neon(process.env.DATABASE_URL);

app.use(cors({
  origin: "http://localhost:3000", // frontend url
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(ClerkExpressWithAuth()); // inject user info into req.auth

// ✅ Test route
app.get("/private", requireAuth(),async (req, res) => {
 const rows = await sql`SELECT id, email FROM users WHERE clerk_id = ${req.auth.userId}`;
  res.json({ message: "✅", user: rows[0] });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
