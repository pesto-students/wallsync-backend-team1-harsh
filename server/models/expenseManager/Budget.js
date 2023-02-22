const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Budget = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "Users" },
		income: { type: Number },
		limit: { type: Number },
		expensesArray: { type: Array },
		total: { type: Number, default: 0 },
		savings: { type: Number },
		date: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

const ExpenseMan = mongoose.model("Budgets", Budget);
module.exports = ExpenseMan;
