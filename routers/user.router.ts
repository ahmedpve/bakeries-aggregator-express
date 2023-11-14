import express from "express";
import { authenticateUser, createUser, getUser } from "../controllers/user.controllers";
import checkAuthentication from "../middlewares/check-authentication";

const router = express.Router();

router.route("/account").get(checkAuthentication, getUser);
router.route("/signup").post(createUser);
router.route("/signin").post(authenticateUser);

export default router;
