const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reactionSchema = Schema(
  {
    emoji: {
      type: String,
      enum: ["like", "love", "haha", "wow", "sad", "angry"],
    },
    owner: {
      ref: "User",
      required: true,
      type: Schema.Types.ObjectId,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  {
    timestamps: true,
  }
);

const Reaction = mongoose.model("Reaction", reactionSchema);
module.exports = Reaction;
