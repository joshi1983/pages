export function findScanToken(filterInfo, tokens, logger) {
	if (typeof filterInfo !== 'object' ||
	filterInfo === null || filterInfo instanceof Array || filterInfo instanceof Set)
		throw new Error('filterInfo must be an object.  Not: ' + filterInfo);
	if (!(tokens instanceof Array))
		throw new Error('tokens must be an Array.  Not: ' + tokens);
	if (typeof logger !== 'function')
		throw new Error('logger must be a function');

	const matches = tokens.filter(function(token) {
		if (filterInfo.s !== undefined && filterInfo.s !== token.s)
			return false;
		if (filterInfo.colIndex !== undefined && filterInfo.colIndex !== token.colIndex)
			return false;
		if (filterInfo.lineIndex !== undefined && filterInfo.lineIndex !== token.lineIndex)
			return false;
		return true;
	});
	if (matches.length !== 1) {
		const filterDescription = JSON.stringify(filterInfo);
		logger(`Expected 1 matched token but found ${matches.length}.  filterInfo = ${filterDescription}`);
	}
	else
		return matches[0];
};