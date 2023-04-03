const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
	{
		description: { type: String, required: true },
		type: { type: String, default: "" },
		amount: { type: Number, required: true },
		date: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

const Transaction = mongoose.model("Transactions", transactionSchema);
module.exports = Transaction;
