const Group = require("../models/billSplit/Group");
const Contribution = require("../models/billSplit/Contribution");
const User = require("../models/user/User");

//add a contribution to the activity/group
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
										group: data.group,
										share: data.amount,
									});
									gd.groupTotal += data.amount;
									gd.save();
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
									// res.json({ lol: gd });
									res.status(202).json({
										finalContributions: gd.finalContributions,
										contributions: gd.contributions,
										total: gd.groupTotal,
									});
								})
								.catch((err) => {
									res.json(err);
								});
						} else {
							res.json("add user to group first");
						}
					} else {
						res.json({ message: "join the group first" });
					}
				})
				.catch((err) => {
					res.json("group not found", err);
				});
		})
		.catch((err) => {
			res.json("user not found", err);
		});
};

//edit a contribution to the activity/group
const editContribution = (req, res) => {
	User.findById(req.params.id)
		.then((ud) => {
			Group.findOne({ groupName: req.params.groupName })
				.then((gd) => {
					Contribution.findByIdAndUpdate(
						req.params.contributionId,
						{
							_id: req.body.id,
							description: req.body.desc,
							amount: req.body.share,
							group: req.body.group,
							contributedBy: req.body.name,
						},
						{
							new: true,
						}
					)
						.then((cd) => {
							gd.contributions.map((i) => {
								if (i.id == cd._id) {
									i.name = cd.contributedBy;
									i.desc = cd.description;
									i.share = cd.amount;
									i.group = cd.group;
								}
							});

							let total = 0;
							gd.contributions.map((i) => {
								total += i.share;
							});
							gd.groupTotal = total;
							gd.markModified("groupTotal");
							gd.markModified("contributions");

							gd.save();
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
							res.json({
								message: `updated contribution`,
								updatedData: cd,
								finalContributions: gd.finalContributions,
							});
						})
						.catch((err) => {
							console.log(err);
							res.json({ message: "error updating contribution", err });
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

//delete a contribution to the activity/group
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
							let total = 0;
							gd.contributions.map((i) => {
								total += i.share;
							});
							gd.groupTotal = total;

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

							gd.markModified("groupTotal");
							gd.markModified("contributions");
							gd.save();

							res.json({
								message: cd._id,
								finalContributions: gd.finalContributions,
							});
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
