import OpenAI from "openai";
import sql from "../db.js";
import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";

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
    return res.json({ success: true, message: responseText });
  } catch (error) {
    console.error("Error generating response:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const gentrateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage || 0;
    if (plan !== "premium" && free_usage >= 10) {
      return res.status(403).json({
        success: false,
        message:
          "Free usage limit reached. Upgrade to premium for more requests.",
      });
    }
    console.log("Generating blog with prompt:", prompt);
    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });
    const responseText = response.choices[0].message.content;
    await sql` INSERT INTO creation (user_id, prompt, context, type) VALUES (${userId}, ${prompt}, ${responseText}, 'blog-title')`;
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }
    return res.json({ success: true, message: responseText });
  } catch (error) {
    console.error("Error generating response:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const gentrateImg = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.status(403).json({
        success: false,
        message:
          "this feature is only available for premium users. Please upgrade your plan.",
      });
    }
    console.log("Generating img with prompt:", prompt);

    const formData = new FormData();
    formData.append('prompt', prompt);

    const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          'x-api-key': process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );
    console.log("Image data received:", data);
    if (!data) {
      return res.status(500).json({ message: "Failed to generate image." });
    }
    const imageUrl = `data:image/png;base64,${Buffer.from(
      data,
      'binary'
    ).toString('base64')}`;

    console.log("Uploading image to Cloudinary..." + imageUrl);

    const { secure_url } = await cloudinary.uploader.upload(imageUrl, {
      resource_type: "image",
    });

    console.log("Image uploaded to Cloudinary:", secure_url);

    await sql` INSERT INTO creation (user_id, prompt, context, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image' ,${
      publish ?? false
    })`;

    return res.json({ success: true, message: secure_url });
  } catch (error) {
    console.error("Error generating response:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};
