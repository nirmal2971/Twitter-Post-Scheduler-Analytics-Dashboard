import { Router } from "express";
import { getTweetSuggestions,getSuggestedTime } from "../controllers/ai.controller";

const router = Router();

router.get("/suggestions", getTweetSuggestions);
router.get("/suggestTime", getSuggestedTime);


export default router;
