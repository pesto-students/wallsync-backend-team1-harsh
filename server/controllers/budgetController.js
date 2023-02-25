const Transaction = require("../models/expenseManager/Transaction");
const Budget = require("../models/expenseManager/Budget");
const User = require("../models/user/User");

const addBudget = (req, res) => {
	const id = req.params.id;
	User.findById(id).then((ud) => {
		const budget = new Budget({
			user: id,
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
		console.log(bd);
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
				expenses: bd.expensesArray,
				total: bd.total,
				savings: bd.savings,
			});
		});
	});
};

const filterBudget = (req, res) => {
	const type = req.params.type;
	Budget.findOne({ user: req.params.user }).then((bd) => {
		let datearr = [];
		let resArr = [];
		if (type === "month") {
			bd.expensesArray.map((i) => {
				datearr.push(i.date.toString().substr(4, 6));
			});
			bd.expensesArray.map((i) => {
				if (i.date.toString().substr(4, 6) === "Feb 18") {
					resArr.push(i);
				}
			});
		}
		res.json(resArr);
	});
};
module.exports = {
	addBudget,
	addTransaction,
	filterBudget,
};
