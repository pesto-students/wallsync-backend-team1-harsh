const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");

router.post("/:id/addBudget", budgetController.addBudget);

router.post("/:user/addExpense", budgetController.addTransaction);

router.get("/:user/filter/:type", budgetController.filterBudget);

module.exports = router;
