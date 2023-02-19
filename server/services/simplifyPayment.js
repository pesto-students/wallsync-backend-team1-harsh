function simplifyPayment(ow, ts) {
	let result = [];
	let simplify = [];
	ow.map((i) => {
		ts.map((j) => {
			if (i.owed < j.toSettle) {
				result.push(
					j.name + " " + "pays" + " " + i.name + " " + "Rs." + i.owed
				);
				j.toSettle = j.toSettle - i.owed;
				i.owed = 0;
			} else if (i.owed === j.toSettle) {
				result.push(
					j.name + " " + "pays" + " " + i.name + " " + "Rs." + i.owed
				);
				i.owed = 0;
				j.toSettle = 0;
			} else {
				result.push(
					j.name + " " + "pays" + " " + i.name + " " + "Rs." + j.toSettle
				);
				i.owed = i.owed - j.toSettle;
				j.toSettle = 0;
			}
		});
	});
	result.forEach((i) => {
		if (!i.includes("Rs.0")) {
			simplify.push(i);
		}
	});
	return simplify;
}

module.exports = simplifyPayment;
