const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema(
	{
		groupName: { type: String, required: true },
		groupDescription: { type: String, default: "" },
		groupMembers: { type: [Schema.Types.String], ref: "Users" },
		groupTotal: { type: Number, default: 0 },
		contributions: {
			type: Array,
		},
		finalContributions: {
			type: Array,
		},
		memberBalances: { type: Array },
		percentageArray: [{ name: String, percent: Number }],
		displayPicture: { type: String },
	},
	{ timestamps: true }
);

const Group = mongoose.model("Groups", groupSchema);
module.exports = Group;
