const express = require("express");
const router = express.Router();

const userController = require("../controllers/users.controller");
const authMiddleware = require("../middlewares/authentication");

router.post("/", userController.create);
router.get("/me", authMiddleware.loginRequired, userController.getCurrentUser);
router.get("/:id", userController.read);
router.put("/:id", userController.update);
router.delete("/:id", userController.destroy);

module.exports = router;
