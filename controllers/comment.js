import CommentModal from "../models/comment.js";

export const addNewCommentToQuestion = async (req, res) => {
  const { id }  = req.params;
  const { user_id } = req.userId;

  console.log(req.userId);
  console.log(id);

  const information = req.body;

  try {
    const comment = await CommentModal.create({
      ...information,
      id,
      user_id,
    });

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    console.log(error);
  }
};
