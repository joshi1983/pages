import { duplicate } from
'../../../command-groups/helpers/duplicate.js';
import { evaluateToken } from
'../evaluation/evaluateToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { StringBuffer } from
'../../../StringBuffer.js';
import { valueToLiteralCode } from
'../../../valueToLiteralCode.js';

function getSingleDimensionSize(dimensionsToken) {
	const children = dimensionsToken.children.filter(t => 
		t.type === ParseTreeTokenType.NUMBER_LITERAL ||
		(t.type === ParseTreeTokenType.BINARY_OPERATOR && t.val.toLowerCase() === 'to'));
	if (children.length !== 1)
		return;
	const child = children[0];
	if (child.type === ParseTreeTokenType.NUMBER_LITERAL)
		return evaluateToken(child);
	else if (child.type === ParseTreeTokenType.BINARY_OPERATOR) {
		const operands = child.children;
		if (operands.length !== 2)
			return;
		const vals = operands.map(evaluateToken);
		if (!Number.isInteger(vals[0]) || !Number.isInteger(vals[1]))
			return;
		return vals[1] - vals[0];
	}
}

function getInitValueForTypes(asToken) {
	if (asToken === undefined)
		return 0;
	if (asToken.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
		const dimensionsToken = asToken;
		asToken = asToken.getNextSibling();
		if (asToken === null)
			return [];
		const dimensionSize = getSingleDimensionSize(dimensionsToken);
		if (dimensionSize === undefined)
			return [];
		const initVal = 0;
		// FIXME: check if initVal should be an empty string.
		return duplicate(initVal, dimensionSize);
	}
	if (asToken.type !== ParseTreeTokenType.AS)
		return 0;
	let gChild = asToken.children[0];
	if (gChild.type === ParseTreeTokenType.DATA_TYPE)
		gChild = gChild.children[0];
	if (gChild === undefined || typeof gChild.val !== 'string')
		return 0;
	const typeName = gChild === undefined ? undefined : gChild.val.toLowerCase();
	if (typeName === 'string')
		return '';
	return 0;
}

export function typeTokenToCreateProcedure(typeToken, procName) {
	const result = new StringBuffer();
	result.append(`\nto ${procName}
	output createPList2 [`);
	// loop through properties.
	const children = typeToken.children;
	for (let i = 1; i < children.length; i++) {
		const child = children[i];
		if (child.type === ParseTreeTokenType.TYPE_PROPERTY) {
			const propChildren = child.children;
			const propNameToken = propChildren[0];
			const initVal = getInitValueForTypes(propChildren[1]);
			result.append(`[${valueToLiteralCode(propNameToken.val)} ${valueToLiteralCode(initVal)} ]`);
		}
	}
	result.append(']\nend\n');
	return result.toString();
};