function categorize(arr) {
	let settle = [];
	let owed = [];
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].toSettle) {
			settle.push(arr[i]);
		} else {
			owed.push(arr[i]);
		}
	}
	return { settle, owed };
}

module.exports = categorize;
