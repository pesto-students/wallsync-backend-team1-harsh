function equalSplit(members) {
	let result = [];
	let total = 0;
	for (let i = 0; i < members.length; i++) {
		total += members[i].share;
	}
	const equally = total / members.length;
	members.map((member) => {
		const remainder = equally - member.share;
		if (remainder > 0) {
			result.push({ name: member.name, toSettle: remainder });
		} else {
			result.push({ name: member.name, owed: Math.abs(remainder) });
		}
	});
	return result;
}

module.exports = equalSplit;
