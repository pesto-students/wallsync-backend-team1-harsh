const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = require("../config/upload");

//user
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/user/:id/groups", userController.getAllGroups);
router.get("/user/:id/repayments", userController.getAllRepayments);
router.get("/user/:id/budget", userController.getBudget);
router.put("/user/:id/update", userController.updateUser);
router.put(
	"/user/:id/updateProfilePicture",
	upload,
	userController.updateProfilePicture
);
//admin
router.get("/admin/:id/users", userController.getUser);
router.get("/admin/:id/groups", userController.getGroup);
router.delete("/admin/:id/delete/:email", userController.deleteUser);
router.delete("/admin/:id/deleteGroup/:groupName", userController.deleteGroup);
router.put("/admin/:id/editUser/:email", userController.adminEditUser);
router.put("/admin/:id/editGroup/:groupName", userController.adminEditGroup);

module.exports = router;
