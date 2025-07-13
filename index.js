// server/index.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from "./routes/routes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use(requireAuth());
app.use("/api/ai", aiRouter);

app.get("/get", (req, res) => {
  res.send("Welcome to the AI Backend Server!");
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
