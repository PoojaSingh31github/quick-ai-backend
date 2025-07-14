import express from "express";
import { gentrateArticle } from "../controlers/aicontroller.js";
import { checkPremiumUser } from "../middlewares/auth.js";
const aiRouter = express.Router();

aiRouter.post("/generate-ariticle", checkPremiumUser, gentrateArticle);

export default aiRouter;
