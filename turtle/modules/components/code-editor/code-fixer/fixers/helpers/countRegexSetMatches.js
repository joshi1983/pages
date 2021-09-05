export function countRegexSetMatches(code, regexSets) {
	let count = 0;
	for (let set of regexSets) {
		if (!set.some(r => r.test(code) === false)) {
			count++;
		}
	}
	return count;
};