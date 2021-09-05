export function sumOfFirsts(list) {
	let result = 0;
	for (const sublist of list) {
		result += sublist[0];
	}
	return result;
};