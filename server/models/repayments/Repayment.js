const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RepaymentSchema = new Schema(
	{
		description: { type: String, required: true },
		amount: { type: Number, required: true },
		dueDate: { type: Date, required: true },
	},
	{ timestamps: true }
);

const Repayment = mongoose.model("Repayments", RepaymentSchema);
module.exports = Repayment;
