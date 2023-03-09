const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const upload = require("../config/upload");

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/:id/groups", userController.getAllGroups);
router.get("/:id/repayments", userController.getAllRepayments);
router.get("/:id/budget", userController.getBudget);
router.get("/:id", userController.getUser);

router.get("/users", userController.getUsers);

module.exports = router;
