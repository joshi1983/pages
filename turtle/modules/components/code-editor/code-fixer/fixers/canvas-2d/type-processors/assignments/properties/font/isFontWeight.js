import { ParseTreeTokenType } from
'../../../../../../../../../parsing/css/ParseTreeTokenType.js';

const weights = new Set(['bold', 'normal']);

export function isFontWeight(cssToken) {
	if (cssToken.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	return weights.has(cssToken.val);
};