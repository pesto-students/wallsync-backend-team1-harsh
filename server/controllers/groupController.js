const Group = require("../models/billSplit/Group");
const Contribution = require("../models/billSplit/Contribution");
const User = require("../models/user/User");
const equalSplit = require("../services/equal");
const unequal = require("../services/unequal");
const categorize = require("../services/categorize");
const simplifyPayment = require("../services/simplifyPayment");

const createGroup = (req, res) => {
	User.findById(req.params.id)
		.then((ud) => {
			const newGroup = new Group(req.body);
			if (ud.groups.includes(req.body.groupName)) {
				res.json("group name already exists");
			} else {
				newGroup
					.save()
					.then((groupData) => {
						groupData.groupMembers.push(ud.firstName);
						groupData.save();
						ud.groups.push(groupData);
						ud.save();
						res.status(201).json(groupData);
					})
					.catch((error) => {
						res.json(error);
					});
			}
		})
		.catch((err) => {
			res.json("error finding user");
		});
};
const getGroup = (req, res) => {
	User.findById(req.params.id)
		.then((ud) => {
			Group.findOne({ groupName: req.params.groupName })
				.then((data) => {
					res.json(data);
				})
				.catch((err) => {
					res.json("Error fetching group data");
				});
		})
		.catch((err) => {
			res.json("error finding user");
		});
};

const addUserToGroup = (req, res) => {
	User.findById(req.params.id)
		.then((ud) => {
			Group.findOne({ groupName: req.params.groupName })
				.then((gd) => {
					User.findOne({ email: req.body.email })
						.then((user) => {
							if (user) {
								if (gd.groupMembers.includes(user.firstName)) {
									res.json("user already exists");
								} else {
									gd.groupMembers.push(user.firstName);
									gd.save();
									res.status(202).json({
										message: "added",
										newUser: user,
										members: gd.groupMembers,
									});
									ud.save();
								}
							} else {
								const options = {
									from: "wallsyncapp@gmail.com",
									to: `${req.body.email}`,
									subject: "WallSync invite",
									text: "Join your friends at WallSync",
								};
								transporter.sendMail(options, function (err, info) {
									if (err) {
										console.log(err);
										return;
									}
									console.log("Sent: " + info.response);
								});
								res.json({ message: `send an invite to ${req.body.email}` });
							}
						})
						.catch((err) => {
							res.json("cannot find email");
						});
				})
				.catch((err) => {
					res.json("group not found");
				});
		})
		.catch((err) => {
			res.json("error finding user");
		});
};

const addPercentageArray = (req, res) => {
	User.findById(req.params.id)
		.then((ud) => {
			Group.findOne({ groupName: req.params.groupName })
				.then((gd) => {
					req.body.map((i) => {
						gd.percentageArray.push({ name: i.name, percent: i.percent });
					});
					gd.save();
					ud.save();

					res.status(202).json(gd.percentageArray);
				})
				.catch((err) => {
					res.json(err);
				});
		})
		.catch((err) => {
			res.json("error finding user");
		});
};
const stats = (req, res) => {
	User.findById(req.params.id)
		.then((ud) => {
			Group.findOne({ groupName: req.params.groupName })
				.then((gd) => {
					let result = [];
					// collecting names not present in the contributed array
					let uniqueNames = [
						...new Set(gd.contributions.map((item) => item.name)),
					];

					uniqueNames.forEach((name) => {
						let shares = 0;
						gd.contributions.forEach((item) => {
							if (item.name === name) {
								shares += item.share;
							}
						});
						result.push({ name, share: shares });
					});

					// inserting members into the result array who have still not contributed
					let updatedResult = [...result];

					gd.groupMembers.forEach((member) => {
						if (!result.find((x) => x.name === member)) {
							updatedResult.push({ name: member, share: 0 });
						}
					});
					gd.finalContributions = updatedResult;
					res.json({ message: "stats array", stats: gd.finalContributions });
				})
				.catch((err) => {
					res.json("group not found");
				});
		})
		.catch((err) => {
			res.json("user not found");
		});
};
const settle = (req, res) => {
	User.findById(req.params.id)
		.then((ud) => {
			Group.findOne({ groupName: req.params.groupName })
				.then((gd) => {
					let result = [];
					// collecting names not present in the contributed array
					let uniqueNames = [
						...new Set(gd.contributions.map((item) => item.name)),
					];

					uniqueNames.forEach((name) => {
						let shares = 0;
						gd.contributions.forEach((item) => {
							if (item.name === name) {
								shares += item.share;
							}
						});
						result.push({ name, share: shares });
					});

					// inserting members into the result array who have still not contributed
					let updatedResult = [...result];

					gd.groupMembers.forEach((member) => {
						if (!result.find((x) => x.name === member)) {
							updatedResult.push({ name: member, share: 0 });
						}
					});
					gd.finalContributions = updatedResult;

					const equalSettle = categorize(equalSplit(updatedResult));
					const unequalSettle = categorize(
						unequal(updatedResult, gd.percentageArray)
					);

					if (req.params.split === "equal") {
						gd.memberBalances = equalSplit(updatedResult);

						res.json({
							settled: equalSplit(updatedResult),
							simplified: simplifyPayment(equalSettle.owed, equalSettle.settle),
						});
					} else {
						gd.memberBalances = unequal(updatedResult, gd.percentageArray);

						res.json({
							settled: unequal(updatedResult, gd.percentageArray),
							simplified: simplifyPayment(
								unequalSettle.owed,
								unequalSettle.settle
							),
						});
					}
					gd.save();
					ud.save();
				})
				.catch((err) => {
					res.json("error calculating");
				});
		})
		.catch((err) => {
			res.json("error finding user");
		});
};
const deleteGroup = (req, res) => {
	User.findById(req.params.id)
		.then((ud) => {
			Group.findOneAndDelete({ groupName: req.params.groupName })
				.then((data) => {
					res.json({ message: "group deleted", deletedGroup: data });
					ud.save();
				})
				.catch((err) => {
					res.json({ messsage: "unable to delete group" });
				});
		})
		.catch((err) => {
			res.json("error finding user");
		});
};
const editGroup = (req, res) => {
	User.findById(req.params.id)
		.then((ud) => {
			Group.findOneAndUpdate({ groupName: req.params.groupName }, req.body, {
				new: true,
			}).then((gd) => {
				res.json({ message: "updated", update: gd });
				ud.save();
			});
		})
		.catch((err) => {
			res.json("error finding user");
		});
};
module.exports = {
	createGroup,
	getGroup,
	addUserToGroup,
	addPercentageArray,
	settle,
	deleteGroup,
	editGroup,
	stats,
};
