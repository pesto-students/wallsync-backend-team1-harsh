const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RepaymentSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "Users" },
		description: { type: String, required: true },
		amount: { type: Number, required: true },
		dueDate: { type: Date, required: true },
	},
	{ timestamps: true }
);

const Repayment = mongoose.model("Repayments", RepaymentSchema);
module.exports = Repayment;
