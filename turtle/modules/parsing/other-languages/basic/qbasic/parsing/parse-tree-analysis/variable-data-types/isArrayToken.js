import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function isArrayToken(token, options) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	const variable = options.variables.get(token.val.toLowerCase());
	if (variable === undefined)
		return false;
	if (variable.isArrayAt(token))
		return true;
	return false;
};