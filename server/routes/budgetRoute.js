const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");

// router.get("/:id/sort", budgetController.sort);
router.post("/:id/addBudget", budgetController.addBudget);
router.post("/:user/addExpense", budgetController.addTransaction);
router.delete(
	"/:user/:expenseId/deleteExpense",
	budgetController.deleteTransaction
);
module.exports = router;
