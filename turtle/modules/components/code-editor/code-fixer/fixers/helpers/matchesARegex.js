export function matchesARegex(regexes, code) {
	for (let r of regexes) {
		if (r.test(code))
			return true;
	}
	return false;
};