const Transaction = require("../models/expenseManager/Budget");
const Budget = require("../models/expenseManager/Budget");
const User = require("../models/user/User");

const addBudget = (req, res) => {
	const id = req.params.id;
	User.findById(id).then((ud) => {
		console.log(ud);
		const budget = new Budget({
			user: id,
			income: req.body.income,
			limit: req.body.limit,
		});
		budget.save().then((ed) => {
			res.json(ed);
		});
	});
};

// const addTransaction = (req, res) => {
// 	// const user = req.params.user;
// 	Budget.findOne({ user: req.params.user }).then((ed) => {
// 		const transaction = new Transaction(req.body);
// 		transaction
// 			.save()
// 			.then((data) => {
// 				ed.expensesArray.push(data);
// 				let total = 0;
// 				ed.expensesArray.map((item) => {
// 					total += item.amount;
// 				});
// 				ed.total = total;

// 				let savings = 0;
// 				savings = ed.income - ed.total;
// 				ed.savings = savings;
// 				ed.save();

// 				res.json({
// 					expense: ed.expensesArray,
// 					total: ed.total,
// 					savings: ed.savings,
// 				});
// 			})
// 			.catch((err) => {
// 				res.json("Error adding transaction");
// 				// console.log(err)
// 			});
// 	});
// };

const addTransaction = (req, res) => {
	Budget.findOne({ user: req.params.user }).then((bd) => {
		console.log(bd);
		const newExpense = new Transaction({
			description: req.body.description,
			amount: req.body.amount,
		});
		newExpense.save().then((data) => {
			bd.expensesArray.push(data);

			console.log(bd.expensesArray);

			res.json(data);
		});
	});
};

const getSummary = (req, res) => {
	// 	const user = req.params.user;
	// 	Budget.findOne({ user }).then((ed) => {
	// 		res.json(ed);
	// 	});
};

const filterBudget = (req, res) => {
	// 	const type = req.params.type;
	// 	Budget.findOne({ user: req.params.user }).then((ed) => {
	// 		let datearr = [];
	// 		let resArr = [];
	// 		if (type === "month") {
	// 			ed.expensesArray.map((i) => {
	// 				datearr.push(i.date.toString().substr(4, 6));
	// 			});
	// 			ed.expensesArray.map((i) => {
	// 				if (i.date.toString().substr(4, 6) === "Feb 18") {
	// 					resArr.push(i);
	// 				}
	// 			});
	// 		}
	// 		res.json(resArr);
	// 	});
};
module.exports = {
	addBudget,
	addTransaction,
	getSummary,
	filterBudget,
};
