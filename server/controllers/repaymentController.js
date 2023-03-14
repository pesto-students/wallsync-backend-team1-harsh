const User = require("../models/user/User");
const Repayment = require("../models/repayments/Repayment");

const addRepayment = (req, res) => {
	User.findById(req.params.id)
		.then((ud) => {
			const repayment = new Repayment(req.body);
			repayment
				.save()
				.then((bd) => {
					ud.repayments.push(bd);
					ud.save();
					res.json(bd);
				})
				.catch((err) => {
					res.json({ message: "error adding repayment" });
				});
		})
		.catch((err) => {
			res.json({ message: "error fetching user" });
		});
};

const editRepayment = (req, res) => {
	console.log(req.body, "bodyyy");
	console.log("backend id", req.params.repaymentId);

	User.findById(req.params.id)
		.then((ud) => {
			Repayment.findByIdAndUpdate(req.params.repaymentId, req.body, {
				new: true,
			})
				.then((rd) => {
					console.log(rd, "rddd");
					res.json({ message: "repayment updated", update: rd });
				})
				.catch((err) => {
					res.json({ message: "error updating repayment" });
				});
		})
		.catch((err) => {
			res.json({ message: "error fetching user" });
		});
};

const deleteRepayment = (req, res) => {
	User.findById(req.params.id)
		.then((ud) => {
			Repayment.findByIdAndDelete(req.params.repaymentId)
				.then(() => {
					ud.save();
					res.json({ message: "repayment deleted" });
				})
				.catch((err) => {
					res.json({ message: "error deleting repayment" });
				});
		})
		.catch((err) => {
			res.json({ message: "error fetching user" });
		});
};

module.exports = {
	addRepayment,
	editRepayment,
	deleteRepayment,
};
