import express from "express";
import { gentrateArticle, gentrateBlogTitle, gentrateImg, removeBackgroundImg, removeObjectImg, reviewResume } from "../controlers/aicontroller.js";
import { checkPremiumUser } from "../middlewares/auth.js";
import { upload } from "../multer.js";
const aiRouter = express.Router();

aiRouter.post("/generate-ariticle", checkPremiumUser, gentrateArticle);
aiRouter.post("/generate-blog", checkPremiumUser, gentrateBlogTitle);
aiRouter.post("/generate-img", checkPremiumUser, gentrateImg);
aiRouter.post("/remove-bg-img",upload.single('img'), checkPremiumUser, removeBackgroundImg);
aiRouter.post("/remove-object", upload.single("img"), checkPremiumUser, removeObjectImg);
aiRouter.post("/review-resume",upload.single("resume"), checkPremiumUser, reviewResume);

export default aiRouter;
