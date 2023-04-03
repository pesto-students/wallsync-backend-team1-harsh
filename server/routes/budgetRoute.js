const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");

router.post("/budget/:id/addBudget", budgetController.addBudget);
router.put("/budget/:id/editBudget", budgetController.editBudget);
router.post("/budget/:id/addExpense", budgetController.addTransaction);
router.delete(
	"/budget/:id/:expenseId/deleteExpense",
	budgetController.deleteTransaction
);
router.put(
	"/budget/:id/:expenseId/editExpense",
	budgetController.editTransaction
);
router.get("/budget/:budgetId/filter", budgetController.filterTransaction);

module.exports = router;
