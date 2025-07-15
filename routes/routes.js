import express from "express";
import { gentrateArticle, gentrateBlogTitle, gentrateImg } from "../controlers/aicontroller.js";
import { checkPremiumUser } from "../middlewares/auth.js";
const aiRouter = express.Router();

aiRouter.post("/generate-ariticle", checkPremiumUser, gentrateArticle);
aiRouter.post("/generate-blog", checkPremiumUser, gentrateBlogTitle);
aiRouter.post("/generate-img", checkPremiumUser, gentrateImg);

export default aiRouter;
