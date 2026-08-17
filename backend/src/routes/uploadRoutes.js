import express from "express";
import multer from "multer";
import { transcribeAudio } from "../controllers/uploadController.js";

const router = express.Router();
const upload = multer({
    storage : multer.memoryStorage()
})

router.post("/transcribe", upload.single("audio"), transcribeAudio);

export default router;