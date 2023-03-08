const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");

router.post("/:id/addBudget", budgetController.addBudget);
router.post("/:user/addExpense", budgetController.addTransaction);
router.delete(
	"/:user/:expenseId/deleteExpense",
	budgetController.deleteTransaction
);
router.put("/:user/:expenseId/editExpense", budgetController.editTransaction);
router.get("/:user/filterExpense", budgetController.filterTransaction);
module.exports = router;
