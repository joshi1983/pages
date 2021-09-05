import { getSpreadToken } from
'./getSpreadToken.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function getStepValueToken(forToken) {
	let rangeToken = getSpreadToken(forToken);
	if (rangeToken === undefined)
		return;

	rangeToken = rangeToken.parentNode;
	if (rangeToken !== undefined &&
	rangeToken.type === ParseTreeTokenType.BINARY_OPERATOR &&
	rangeToken.val.toLowerCase() === 'by')
		return rangeToken.children[1];
};