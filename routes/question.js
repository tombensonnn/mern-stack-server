import express from "express";
const router = express.Router();
import comment from "./comment.js"
import {auth} from "../middleware/auth.js";

import {
  createQuestion,
  getQuestions,
  getQuestion,
  getQuestionsByUser,
  deleteQuestion,
  updateQuestion,
  getQuestionsBySearch,
  getQuestionsByTag,
  getRelatedQuestions,
  likeQuestion
} from "../controllers/question.js";

import {addNewCommentToQuestion} from "../controllers/comment.js";

// router.use("/:id/comment", comment);
router.post("/:id/comment", auth, addNewCommentToQuestion);
router.get("/search", getQuestionsBySearch) // sıkıntı
router.get("/tag/:tag", getQuestionsByTag)
router.post("/relatedQuestions", getRelatedQuestions)
router.get("/", getQuestions);
router.get("/:id", getQuestion);

router.post("/", auth, createQuestion);
router.delete("/:id", auth, deleteQuestion);
router.patch("/:id", auth, updateQuestion);
router.get("/userQuestions/:id", auth, getQuestionsByUser);
router.patch("/like/:id", auth, likeQuestion);




export default router;
