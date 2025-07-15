import express from "express";
import { getPublishedCreations, getUserCreations, toggleCreation } from "../controlers/usercontroller.js";
import { checkPremiumUser } from "../middlewares/auth.js";


const userRouter = express.Router();
userRouter.get("/all-creations", checkPremiumUser, getUserCreations);
userRouter.get("/all-published", checkPremiumUser, getPublishedCreations);
userRouter.post("/likes", checkPremiumUser, toggleCreation);

export default userRouter;
