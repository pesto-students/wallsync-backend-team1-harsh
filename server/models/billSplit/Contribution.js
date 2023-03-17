const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseSchema = new Schema(
	{
		description: { type: String, required: true },
		amount: { type: Number, required: true },
		group: { type: Schema.Types.String, ref: "Groups", required: true },
		contributedBy: {
			type: Schema.Types.String,
			ref: "Users",
			required: true,
		},
	},
	{ timestamps: true }
);

const Contribution = mongoose.model("Contributions", expenseSchema);
module.exports = Contribution;
