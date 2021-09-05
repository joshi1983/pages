export function countRegexMatches(code, regexes) {
	let count = 0;
	for (let r of regexes) {
		if (r.test(code)) {
			count++;
		}
	}
	return count;
};