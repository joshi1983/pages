import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const customFunctionOrSubTypes = new Set([
	ParseTreeTokenType.SUB, ParseTreeTokenType.DEF, ParseTreeTokenType.FUNCTION
]);

export { customFunctionOrSubTypes };

export function isCustomFunctionOrSubToken(token) {
	if (!customFunctionOrSubTypes.has(token.type))
		return false;

	return true;
};