import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

const valueMap = new Map([
	['PI', Math.PI],
	['TWO_PI', Math.PI * 2],
	['HALF_PI', Math.PI / 2],
	['QUARTER_PI', Math.PI / 4],
	['TAU', Math.PI * 2]
]);

const restrictedParentTypes = new Set([
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.METHOD_CALL
]);

export function evaluateIdentifier(token) {
	if (restrictedParentTypes.has(token.parentNode.type))
		return;

	return valueMap.get(token.val);
};