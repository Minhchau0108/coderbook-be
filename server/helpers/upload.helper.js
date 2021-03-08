const multer = require("multer");
console.log("running to here");
const storage = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = {
  upload: multer({
    storage,
  }),
};
