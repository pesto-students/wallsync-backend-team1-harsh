const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BudgetSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "Users" },
		income: { type: Number },
		limit: { type: Number },
		expensesArray: { type: Array },
		total: { type: Number, default: 0 },
		savings: { type: Number },
		date: { type: Date, default: Date.now },
		monthly: { type: Object },
	},
	{ timestamps: true }
);

const Budget = mongoose.model("Budgets", BudgetSchema);
module.exports = Budget;
