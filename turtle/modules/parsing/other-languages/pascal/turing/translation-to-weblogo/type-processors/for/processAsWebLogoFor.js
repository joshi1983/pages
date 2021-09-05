import { getFinalValueToken } from
'./getFinalValueToken.js';
import { getStartValueToken } from
'./getStartValueToken.js';
import { getStepValueToken } from
'./getStepValueToken.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { processToken } from
'../processToken.js';
import { valueToLiteralCode } from
'../../../../../../../valueToLiteralCode.js';

function getCodeBlock(forToken) {
	for (const child of forToken.children) {
		if (child.type === ParseTreeTokenType.CODE_BLOCK)
			return child;
	}
}

export function processAsWebLogoFor(token, result) {
	const children = token.children;
	if (children.length < 2)
		return false;

	let nameIndex = 0;
	let isDecreasing = false;
	if (children[0].type === ParseTreeTokenType.DECREASING) {
		isDecreasing = true;
		nameIndex++;
	}
	const nameToken = children[nameIndex];
	if (nameToken.children.length !== 0 ||
	nameToken.type !== ParseTreeTokenType.IDENTIFIER)
		return false;

	const variableName = nameToken.val;
	const startValue = getStartValueToken(token);
	const finalValue = getFinalValueToken(token);
	if (startValue === undefined ||
	finalValue === undefined ||
	typeof variableName !== 'string')
		return false;

	const stepToken = getStepValueToken(token);
	result.append(`\nfor [${valueToLiteralCode(variableName)} `);
	processToken(startValue, result);
	result.append(' ');
	processToken(finalValue, result);

	if (stepToken !== undefined) {
		result.append(' ');
		if (isDecreasing) {
			result.append(' -( ');
		}
		processToken(stepToken, result);
		if (isDecreasing)
			result.append(' ) ');
	}
	else if (isDecreasing) {
		result.append(' -1 ');
	}

	result.append(' ] [\n');
	const codeBlock = getCodeBlock(token);
	if (codeBlock !== undefined)
		processToken(codeBlock, result);
	
	result.append('\n]\n');
	return true;
};