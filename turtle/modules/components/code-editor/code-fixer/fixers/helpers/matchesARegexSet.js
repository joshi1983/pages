export function matchesARegexSet(sets, code) {
	for (const set of sets) {
		if (!set.some(r => r.test(code) === false))
			return true;
	}
	return false;
};