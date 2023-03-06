const Group = require("../models/billSplit/Group");
const Contribution = require("../models/billSplit/Contribution");
const User = require("../models/user/User");

// const addContribution = (req, res) => {
// 	Group.findOne({ groupName: req.params.groupName })
// 		.then((gd) => {
// 			User.findOne({ firstName: req.params.firstName })
// 				.then((user) => {
// 					if (gd.groupMembers.includes(user.firstName)) {
// 						const newCont = new Contribution(req.body);
// 						if (gd.groupMembers.includes(req.body.contributedBy)) {
// 							newCont
// 								.save()
// 								.then((data) => {
// 									gd.contributions.push({
// 										id: data._id.toString(),
// 										name: data.contributedBy,
// 										desc: data.description,
// 										share: data.amount,
// 									});
// 									gd.groupTotal += data.amount;
// 									gd.save();
// 									res.status(202).json({
// 										contributions: gd.contributions,
// 										total: gd.groupTotal,
// 									});
// 								})
// 								.catch((err) => {
// 									res.json("error add contribution");
// 								});
// 						} else {
// 							res.json("add user to group first");
// 						}
// 					} else {
// 						res.json({ message: "join the group first" });
// 					}
// 				})
// 				.catch((err) => {
// 					res.json("user not found");
// 				});
// 		})
// 		.catch((err) => {
// 			res.json("group not found");
// 		});
// };

const addContribution = (req, res) => {
	User.findById(req.params.id)
		.then((ud) => {
			Group.findOne({ groupName: req.params.groupName })
				.then((gd) => {
					if (gd.groupMembers.includes(ud.firstName)) {
						const newCont = new Contribution(req.body);
						if (gd.groupMembers.includes(req.body.contributedBy)) {
							newCont
								.save()
								.then((data) => {
									gd.contributions.push({
										id: data._id.toString(),
										name: data.contributedBy,
										desc: data.description,
										share: data.amount,
									});
									gd.groupTotal += data.amount;
									gd.save();
									res.status(202).json({
										contributions: gd.contributions,
										total: gd.groupTotal,
									});
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
				.catch("group not found");
		})
		.catch((err) => {
			res.json("user not found");
		});
};

const editContribution = (req, res) => {
	User.findById(req.params.id)
		.then((ud) => {
			Group.findOne({ groupName: req.params.groupName })
				.then((gd) => {
					Contribution.findByIdAndUpdate(req.params.contributionId, req.body, {
						new: true,
					})
						.then((cd) => {
							console.log(cd);
							const index = gd.contributions.findIndex(
								(item) => item.id.toString() === req.params.contributionId
							);
							if (index !== -1) {
								gd.contributions[index] = {
									id: cd._id,
									name: cd.contributedBy,
									desc: cd.description,
									share: cd.amount,
								};
							}
							gd.save();
							res.json({ message: `${cd}-updated contribution` });
						})
						.catch((err) => {
							res.json({ message: "error updating contribution" });
						});
				})
				.catch((err) => {
					res.json({ message: "group not found" });
				});
		})
		.catch((err) => {
			res.json({ message: "user not found" });
		});
};

const deleteContribution = (req, res) => {
	User.findById(req.params.id)
		.then((ud) => {
			Group.findOne({ groupName: req.params.groupName })
				.then((gd) => {
					Contribution.findByIdAndDelete(req.params.contributionId)
						.then((cd) => {
							console.log(req.params.contributionId);
							gd.contributions = gd.contributions.filter(
								(item) => item.id !== req.params.contributionId
							);

							gd.save();
							res.json({ message: `${cd}-deleted contribution` });
						})
						.catch((err) => {
							res.json({ message: "error deleting contribution" });
						});
				})
				.catch((err) => {
					res.json({ message: "group not found" });
				});
		})
		.catch((err) => {
			res.json({ message: "user not found" });
		});
};
module.exports = {
	addContribution,
	editContribution,
	deleteContribution,
};
