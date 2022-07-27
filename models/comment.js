import mongoose from "mongoose";

import QuestionModal from "../models/question.js";

const commentSchema = mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  imageFile: {
    type: String,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: [
    {
      type: String
    }
  ],
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  },
});

commentSchema.pre("save", async function (next) {
  if (!this.isModified("creator")) return next();

  try {
    const question = await QuestionModal.findById(this.question);


    await question.updateOne(    
        {$push: { comments: this._id }}
    );

    console.log(question);

    question.comments.push(this._id);
    await question.save();
    next();
  } catch (err) {
    console.log(err);
  }
});



const CommentModal = mongoose.model("Comment", commentSchema);

export default CommentModal;
