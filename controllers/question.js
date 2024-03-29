import QuestionModal from "../models/question.js";
import mongoose from "mongoose";

export const createQuestion = async (req, res) => {
  const question = req.body;
  const newQuestion = new QuestionModal({
    ...question,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong." });
  }
};

export const getQuestions = async (req, res) => {
  const { page } = req.query;
  try {
    // const questions = await QuestionModal.find();
    // res.status(200).json(questions);

    // slice(0).reverse()
    // const questions = await QuestionModal.find().limit(limit).skip(startIndex)

    const limit = 9;
    const startIndex = (Number(page) - 1) * limit;
    const total = await QuestionModal.countDocuments({});
    const questions = await QuestionModal.find()
      .sort({ _id: -1 })
      .limit(limit)
      .skip(startIndex);

    res.json({
      data: questions,
      currentPage: Number(page),
      totalQuestions: total,
      numberOfPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res
      .status(404)
      .json({ message: "Something went wrong while getting ALL questions." });
  }
};

export const getQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await QuestionModal.findById(id);
    res.status(200).json(question);
  } catch (error) {
    res
      .status(404)
      .json({ message: "Something went wrong while getting question." });
  }
};

export const getQuestionsByUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "User does not exist." });
  }
  // const userQuestions = await QuestionModal.find({ creator: id });
  const userQuestions = await QuestionModal.find({ creator: id }).sort({ _id: -1 });

  res.status(200).json(userQuestions);
};

export const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ message: `No Question Exist with id: ${id} ` });
    }
    await QuestionModal.findByIdAndRemove(id);
    res.json({ message: "Question Deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: "Something went wrong." });
  }
};

export const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { title, description, creator, imageFile, tags } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ message: `No Question Exist with id: ${id} ` });
    }
    const updatedQuestion = {
      creator,
      title,
      description,
      tags,
      imageFile,
      _id: id,
    };
    await QuestionModal.findByIdAndUpdate(id, updatedQuestion, { new: true });
    res.json(updatedQuestion);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong." });
  }
};

export const getQuestionsBySearch = async (req, res) => {
  const { searchQuery } = req.query;

  try {
    const title = new RegExp(searchQuery, "i");
    // const questions = await QuestionModal.find({ title });
    const questions = await QuestionModal.find({ title }).sort({ _id: -1 });
    res.json(questions);
  } catch (error) {
    // console.log(error)
    // console.log(searchQuery)
    res
      .status(404)
      .json({ message: "Something went wrong while searching question." });
  }
};

export const getQuestionsByTag = async (req, res) => {
  const { tag } = req.params;
  const { pageTag } = req.query;

  try {
    const limit = 9;
    const startIndex = (Number(pageTag) - 1) * limit;
    const total = await QuestionModal.countDocuments({tags: { $in: tag }});
    const tagQuestions = await QuestionModal.find({ tags: { $in: tag } }).sort({ _id: -1 }).limit(limit).skip(startIndex);

    res.json(
      {
        data:tagQuestions,
        currentTagPage: Number(pageTag),
        totalTagQuestions: total,
        numberOfTagPages: Math.ceil(total / limit)
      });

  } catch (error) {
    res
      .status(404)
      .json({ message: "Something went wrong..."});
  }
};

// export const getQuestionsByTag = async (req, res) => {
//   const { tag } = req.params;

//   try {
//     const questions = await QuestionModal.find({ tags: { $in: tag } }).sort({ _id: -1 });
//     res.json(questions);
//   } catch (error) {
//     // console.log(error)
//     // console.log(searchQuery)
//     res
//       .status(404)
//       .json({ message: "Something went wrong" });
//   }
// };

export const getRelatedQuestions = async (req, res) => {
  const tags = req.body;

  try {
    // const questions = await QuestionModal.find({ tags: { $in: tags } });
    const questions = await QuestionModal.aggregate([{$match: {tags: {$in:tags}}}, {$sample: {size: 4}}]);
    
    res.json(questions);
  } catch (error) {
    // console.log(error)
    // console.log(searchQuery)
    res
      .status(404)
      .json({ message: "Something went wrong" });
  }
};

export const likeQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.userId) {
      return res.json({ message: "User is not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ message: `No Question Exist with id: ${id} ` });
    }

    const question = await QuestionModal.findById(id);
    const index = question.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      question.likes.push(req.userId);
    } else {
      question.likes = question.likes.filter((id) => id !== String(req.userId));
    }

    const updatedQuestion = await QuestionModal.findByIdAndUpdate(
      id,
      question,
      { new: true }
    );

    res.status(200).json(updatedQuestion);
  } catch (error) {
    res
      .status(404)
      .json({ message: "Something went wrong" });
      // .json({ message: error.message });
  }
};
