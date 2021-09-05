import { getSpreadToken } from
'./getSpreadToken.js';

export function getStartValueToken(forToken) {
	const rangeToken = getSpreadToken(forToken);
	if (rangeToken !== undefined)
		return rangeToken.children[0];
};