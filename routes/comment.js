import express from "express";
const router = express.Router();
import {addNewCommentToQuestion} from "../controllers/comment.js";
import {auth} from "../middleware/auth.js";

router.post("/", auth, addNewCommentToQuestion)


export default router;