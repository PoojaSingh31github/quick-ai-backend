import express from "express";
import { gentrateArticle } from "../controlers/aicontroller";
import { checkPremiumUser } from "../middlewares/auth";
const aiRouter = express.Router();

aiRouter.post("/generate-ariticle", checkPremiumUser, gentrateArticle);
export default aiRouter;
