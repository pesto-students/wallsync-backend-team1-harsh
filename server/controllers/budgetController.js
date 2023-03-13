const Transaction = require("../models/expenseManager/Transaction");
const Budget = require("../models/expenseManager/Budget");
const User = require("../models/user/User");

const addBudget = (req, res) => {
	User.findById(req.params.id).then((ud) => {
		const budget = new Budget({
			user: req.params.id,
			income: req.body.income,
			limit: req.body.limit,
		});
		budget.save().then((bd) => {
			ud.budgets.push(bd);
			ud.save();
			res.json(bd);
		});
	});
};

const addTransaction = (req, res) => {
	Budget.findOne({ user: req.params.user }).then((bd) => {
		const newExpense = new Transaction({
			description: req.body.description,
			amount: req.body.amount,
		});
		newExpense.save().then((data) => {
			bd.expensesArray.push(data);
			let total = 0;
			bd.expensesArray.map((i) => {
				total += i.amount;
			});
			bd.total = total;

			let savings = bd.income - bd.total;
			bd.savings = savings;

			bd.save();
			res.json({
				newTransaction: data,
				expenses: bd.expensesArray,
				total: bd.total,
				savings: bd.savings,
			});
		});
	});
};

const deleteTransaction = (req, res) => {
	Budget.findOne({ user: req.params.user })
		.then((bd) => {
			Transaction.findByIdAndDelete(req.params.expenseId)
				.then((td) => {
					bd.expensesArray = bd.expensesArray.filter(
						(item) => item._id.toString() !== req.params.expenseId
					);

					let total = 0;
					bd.expensesArray.map((i) => {
						total += i.amount;
					});
					bd.total = total;
					let savings = bd.income - bd.total;
					bd.savings = savings;
					bd.markModified("expensesArray");
					bd.markModified("total");
					bd.markModified("savings");

					bd.save();
					res.json({
						deletedId: td._id,
						message: "transaction deleted",
						savings: bd.savings,
					});
				})
				.catch((err) => {
					res.json({ message: "no transaction found" });
				});
		})
		.catch((err) => {
			res.json({ message: "no budget found" });
		});
};

const editTransaction = (req, res) => {
	Budget.findOne({ user: req.params.user })
		.then((bd) => {
			Transaction.findByIdAndUpdate(req.params.expenseId, req.body, {
				new: true,
			})
				.then((td) => {
					const index = bd.expensesArray.findIndex(
						(item) => item._id.toString() === req.params.expenseId
					);
					if (index !== -1) {
						bd.expensesArray[index] = {
							_id: td._id,
							description: td.description,
							amount: td.amount,
							date: td.date,
						};
					}
					let total = 0;
					bd.expensesArray.map((i) => {
						total += i.amount;
					});
					bd.total = total;
					let savings = bd.income - bd.total;
					bd.savings = savings;
					bd.markModified("expensesArray");
					bd.markModified("total");
					bd.markModified("savings");
					bd.save();
					res.json({ message: "transaction updated" });
				})
				.catch((err) => {
					res.json({ message: "no transaction found" });
				});
		})
		.catch((err) => {
			res.json({ message: "no budget found" });
		});
};
const filterTransaction = (req, res) => {
	Budget.findById(req.params.budgetId)
		.then((bd) => {
			console.log(bd.monthly);
			console.log(bd.expensesArray);
			bd.expensesArray.forEach((expense) => {
				const month = expense.date.slice(0, 7);
				if (!bd.monthly[month]) {
					bd.monthly[month] = [];
				}
				bd.monthly[month].push(expense);
			});
			console.log("here==============", bd.monthly);
			bd.save();
			res.json(bd.monthly);
		})
		.catch((err) => {
			res.json({ message: "no budget found" });
		});
};

// const filterTransaction = (req, res) => {
// 	Budget.findById(req.params.budgetId)
// 		.then((bd) => {
// 			if (!bd) {
// 				return res.json({ message: "no budget found" });
// 			}
// 			console.log(bd.monthly);
// 			console.log(bd.expensesArray);
// 			bd.expensesArray.forEach((expense) => {
// 				const month = expense.date.slice(0, 7);
// 				if (!bd.monthly[month]) {
// 					bd.monthly[month] = [];
// 				}
// 				bd.monthly[month].push(expense);
// 			});
// 			console.log("here==============", bd.monthly);
// 			bd.save();
// 			res.json(bd.monthly);
// 		})
// 		.catch((err) => {
// 			res.json({ message: "no budget found" });
// 		});
// };

module.exports = {
	addBudget,
	addTransaction,
	filterTransaction,
	deleteTransaction,
	editTransaction,
};
