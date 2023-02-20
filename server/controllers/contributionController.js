const Group = require("../models/billSplit/Group");
const Contribution = require("../models/billSplit/Contribution");
const User = require("../models/user/User");

const addContribution = (req, res) => {
	Group.findOne({ groupName: req.params.groupName })
		.then((gd) => {
			User.findOne({ firstName: req.params.firstName })
				.then((user) => {
					const newCont = new Contribution(req.body);

					newCont
						.save()
						.then((data) => {
							gd.contributions.push({
								name: data.contributedBy,
								desc: data.description,
								share: data.amount,
							});
							gd.groupTotal += data.amount;
							gd.save();
							res
								.status(201)
								.json({ contri: gd.contributions, total: gd.groupTotal });
						})
						.catch((err) => {
							res.json("error1");
						});
				})
				.catch((err) => {
					res.json("error2");
				});
		})
		.catch((err) => {
			res.json("error3");
		});
};

module.exports = {
	addContribution,
};
