const Reaction = require("../models/Reaction");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");

const reactionsController = {};

reactionsController.create = catchAsync(async (req, res) => {
  console.log("req", req.body);
  const { targetType, targetId, emoji } = req.body;
  let reaction;
  let post;
  if (targetType === "Post") {
    reaction = await Reaction.create({
      owner: req.userId,
      emoji: emoji,
      post: targetId,
    });
    post = await Post.findById(targetId);
    post.reactions.push(reaction._id);
    await post.save();
    await post.populate("comments");
    await post.populate({
      path: "reactions",
      populate: { path: "owner" },
    });
    await post.execPopulate();
  }

  if (targetType === "Comment") {
    reaction = await Reaction.create({
      owner: req.userId,
      emoji: emoji,
      comment: targetId,
    });
    let comment = await Comment.findById(targetId);
    comment.reactions.push(reaction._id);
    await comment.save();

    if (comment) {
      post = await Post.findById(comment.post)
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
  }

  console.log(reaction);
  res.json(post);
});

module.exports = reactionsController;
