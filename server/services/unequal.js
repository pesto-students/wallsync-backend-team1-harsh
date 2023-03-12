function unequal(members, percentageArr) {
	let result = [];
	let total = 0;
	for (let i = 0; i < members.length; i++) {
		total += members[i].share;
	}
	for (let i = 0; i < percentageArr.length; i++) {
		members.map((member) => {
			if (percentageArr[i].name == member.name) {
				const split = total * (percentageArr[i].percent / 100);
				const remainder = split - member.share;
				if (remainder > 0) {
					result.push({ name: member.name, toSettle: remainder.toFixed(2) });
				} else {
					result.push({
						name: member.name,
						owed: Math.abs(remainder.toFixed(2)),
					});
				}
			}
		});
	}
	return result;
}

module.exports = unequal;
