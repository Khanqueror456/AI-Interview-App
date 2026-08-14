import express from "express"
import { protectRoute } from "../middleware/authMiddleware.js";
import { deleteUser, getUser, updateUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protectRoute, getUser);
router.put("/profile", protectRoute, updateUser);
router.delete("/profile", protectRoute, deleteUser);

export default router;