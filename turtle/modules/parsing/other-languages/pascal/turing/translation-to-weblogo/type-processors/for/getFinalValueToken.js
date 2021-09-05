import { getSpreadToken } from
'./getSpreadToken.js';

export function getFinalValueToken(forToken) {
	const rangeToken = getSpreadToken(forToken);
	if (rangeToken !== undefined)
		return rangeToken.children[1];
};