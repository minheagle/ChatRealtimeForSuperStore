import express from "express";
import {
  register,
  getDetail,
  getAllUsers,
  setUserName,
  setAvatar,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.get("/get-detail/:id", getDetail);
router.get("/allusers/:id", getAllUsers);
router.post("/set-user-name/:id", setUserName);
router.post("/set-avatar/:id", setAvatar);

export default router;
