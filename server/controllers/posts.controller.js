const Post = require("../models/Post");
const Comment = require("../models/Comment");

const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");

const postController = {};

postController.create = catchAsync(async (req, res) => {
  console.log("req.body", req.body);

  const post = await Post.create({ owner: req.userId, ...req.body });
  res.json(post);
});

postController.read = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params.id });
  if (!post)
    return next(new AppError(404, "Post not found", "Get Single Post Error"));

  await post.populate("owner").populate("comments").populate("reactions");
  await post.execPopulate();

  res.json(post);
});

postController.update = catchAsync(async (req, res) => {
  await Post.findByIdAndUpdate(
    { _id: req.params.id },
    { email: req.body.email },
    { new: true },
    (err, post) => {
      console.log({ err, post });
      if (!post) {
        res.status(404).json({ message: "Post not Found" });
      } else {
        res.json(post);
      }
    }
  );
});

postController.destroy = catchAsync(async (req, res) => {
  await Post.findByIdAndDelete(req.params.id, (err, post) => {
    if (!post) {
      res.status(404).json({ message: "Post not Found" });
    } else {
      res.json(post);
    }
  });
});

postController.createComment = async (req, res) => {
  console.log("userID", req.userId);
  const comment = await Comment.create({
    ...req.body,
    owner: req.userId,
    post: req.params.id,
  });

  const post = await Post.findById(req.params.id);
  post.comments.push(comment._id);

  await post.save();
  await post.populate({
    path: "comments",
    populate: { path: "owner" },
  });
  await post.execPopulate();

  return sendResponse(res, 200, true, { post }, null, "Comment created!");
};

postController.list = catchAsync(async (req, res) => {
  console.log("req", req.query);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const query = (req.query.title && req.query.title.$regex) || "";
  const author = req.query.author;
  const offset = limit * (page - 1);

  let totalResults;
  let posts;
  if (author) {
    totalResults = await Post.find({
      body: { $regex: query },
      owner: author,
    }).countDocuments();
    posts = await Post.find({ body: { $regex: query }, owner: author })
      .skip(offset)
      .limit(limit)
      .sort(req.query.sortBy)
      .populate("owner")
      .populate({
        path: "comments",
        populate: { path: "owner" },
      })
      .populate({
        path: "comments",
        populate: { path: "reactions" },
      })
      .populate({
        path: "reactions",
        populate: { path: "owner" },
      });
  }
  if (!author) {
    totalResults = await Post.find({
      body: { $regex: query },
    }).countDocuments();
    posts = await Post.find({ body: { $regex: query } })
      .skip(offset)
      .limit(limit)
      .sort(req.query.sortBy)
      .populate("owner")
      .populate({
        path: "comments",
        populate: { path: "owner" },
      })
      .populate({
        path: "comments",
        populate: { path: "reactions" },
      })
      .populate({
        path: "reactions",
        populate: { path: "owner" },
      });
  }

  return sendResponse(
    res,
    200,
    true,
    { posts, totalPages: Math.ceil(totalResults / limit) },
    null,
    "Received posts"
  );
});

module.exports = postController;
