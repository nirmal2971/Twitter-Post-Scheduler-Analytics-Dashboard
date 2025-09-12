import { Router } from "express";
import { getTweetSuggestions } from "../controllers/ai.controller";

const router = Router();

router.get("/suggestions", getTweetSuggestions);

export default router;
