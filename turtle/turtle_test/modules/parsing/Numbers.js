const signedNumberRegEx = new RegExp('^[+-]?((\\d+\\.?\\d*[eE][-+]?\\d+)|(\\.\\d+)|(\\d+\\.\\d*)|(\\d+))');

export { signedNumberRegEx };

export function findLongestMatch(s) {
	if (typeof s !== 'string')
		throw new Error('findLongestMatch requires a string');
	const matchResults = s.match(signedNumberRegEx);
	if (matchResults === null)
		return '';
	const matches = matchResults.filter((m) => typeof m === 'string');
	const maxLen = Math.max(...matches.map((m) => m.length));
	return matches.filter((m) => m.length === maxLen)[0];
};

export function isNumeric(s) {
	if (typeof s !== 'string')
		throw new Error('isNumeric requires a string');
	if (s === '' || s === '+' || s === '-')
		return false;
	const m = findLongestMatch(s);
	return m.length === s.length;
};