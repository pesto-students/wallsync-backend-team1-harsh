const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");

router.post("/budget/:id/addBudget", budgetController.addBudget);
router.post("/budget/:user/addExpense", budgetController.addTransaction);
router.delete(
	"/budget/:user/:expenseId/deleteExpense",
	budgetController.deleteTransaction
);
router.put(
	"/budget/:user/:expenseId/editExpense",
	budgetController.editTransaction
);
router.get("/budget/:user/filter", budgetController.filterTransaction);
module.exports = router;
