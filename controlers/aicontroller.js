import OpenAI from "openai";
import sql from "../db.js";
import { clerkClient } from "@clerk/express";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const gentrateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage || 0;
    if (plan !== "premium" && free_usage >= 10) {
      return res.status(403).json({
        success: false,
        message:
          "Free usage limit reached. Upgrade to premium for more requests.",
      });
    }
    console.log("Generating article with prompt:", prompt);
    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length || 1000,
    });
    const responseText = response.choices[0].message.content;
    await sql` INSERT INTO creation (user_id, prompt, context, type) VALUES (${userId}, ${prompt}, ${responseText}, 'article')`;
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }
    return res.json({ success:true, message: responseText });
  } catch (error) {
    console.error("Error generating response:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};
