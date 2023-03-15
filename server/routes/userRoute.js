const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
router.post("/register", userController.register);
router.post("/login", userController.login);
const upload = require("../config/upload");

router.get("/user/:id/groups", userController.getAllGroups);
router.get("/user/:id/repayments", userController.getAllRepayments);
router.get("/user/:id/budget", userController.getBudget);
router.get("/user/:id", userController.getUser);
router.put("/user/:id/update", userController.updateUser);
router.get("/users", userController.getUsers);
// router.put(
// 	"/user/:id/updateProfilePicture",
// 	multer().single("file"),
// 	userController.updateProfilePicture
// );
router.put(
	"/user/:id/updateProfilePicture",
	upload,
	userController.updateProfilePicture
);

module.exports = router;
