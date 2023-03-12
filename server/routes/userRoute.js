const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/user/:id/groups", userController.getAllGroups);
router.get("/user/:id/repayments", userController.getAllRepayments);
router.get("/user/:id/budget", userController.getBudget);
router.get("/user/:id", userController.getUser);
router.put("/user/:id/update", userController.updateUser);
router.get("/users", userController.getUsers);

module.exports = router;
