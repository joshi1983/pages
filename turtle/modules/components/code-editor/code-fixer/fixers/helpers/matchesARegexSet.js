export function matchesARegexSet(sets, code) {
	if (typeof code !== 'string')
		throw new Error(`code must be a string but found ${code}`);
	for (const set of sets) {
		if (!set.some(r => r.test(code) === false))
			return true;
	}
	return false;
};