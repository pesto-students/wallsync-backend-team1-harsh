const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/:id/groups", userController.getAllGroups);
router.get("/:id/repayments", userController.getAllRepayments);
router.get("/:id/budget", userController.getBudget);

module.exports = router;
