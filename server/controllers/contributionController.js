const Group = require("../models/billSplit/Group");
const Contribution = require("../models/billSplit/Contribution");
const User = require("../models/user/User");

const addContribution = (req, res) => {
	Group.findOne({ groupName: req.params.groupName })
		.then((gd) => {
			User.findOne({ firstName: req.params.firstName })
				.then((user) => {
					if (gd.groupMembers.includes(user.firstName)) {
						const newCont = new Contribution(req.body);
						if (gd.groupMembers.includes(req.body.name)) {
							newCont
								.save()
								.then((data) => {
									gd.contributions.push({
										id: data._id,
										name: data.contributedBy,
										desc: data.description,
										share: data.amount,
									});
									gd.groupTotal += data.amount;
									gd.save();
									res
										.status(202)
										.json({ contri: gd.contributions, total: gd.groupTotal });
								})
								.catch((err) => {
									res.json("error add contribution");
								});
						} else {
							res.json("add user to group first");
						}
					} else {
						res.json({ message: "join the group first" });
					}
				})
				.catch((err) => {
					res.json("user not found");
				});
		})
		.catch((err) => {
			res.json("group not found");
		});
};

module.exports = {
	addContribution,
};
