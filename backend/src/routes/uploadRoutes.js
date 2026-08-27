import express from "express";
import multer from "multer";
import { transcribeAudio } from "../controllers/uploadController.js";
import { synthesizeSpeech } from "../controllers/ttsController.js";

const router = express.Router();
const upload = multer({
    storage : multer.memoryStorage()
})

router.post("/transcribe", upload.single("audio"), transcribeAudio);
router.post("/synthesize", synthesizeSpeech);

export default router;