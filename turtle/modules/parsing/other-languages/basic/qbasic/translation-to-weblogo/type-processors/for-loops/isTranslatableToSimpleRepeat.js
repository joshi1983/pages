import { evaluateToken } from
'../../../evaluation/evaluateToken.js';
import { getCodeBlockFromFor } from
'./getCodeBlockFromFor.js';
import { isTranslatableToRepeat } from
'./isTranslatableToRepeat.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

function findNestedUntranslatableVariableReference(varName, token, isInFutureRepeat) {
	if (isInFutureRepeat) {
		if (token.type === ParseTreeTokenType.IDENTIFIER &&
		varName === token.val.toLowerCase())
			return true;
	}
	if (isTranslatableToRepeat(token))
		isInFutureRepeat = true;
	for (const child of token.children) {
		const result = findNestedUntranslatableVariableReference(varName, child, isInFutureRepeat);
		if (result === true)
			return true;
	}
	return false;
}

export function isTranslatableToSimpleRepeat(forToken) {
	const children = forToken.children;
	if (children.length < 2)
		return false;
	const toToken = children[0];
	if (toToken.type !== ParseTreeTokenType.BINARY_OPERATOR ||
	toToken.val.toLowerCase() !== 'to')
		return false;

	const initToken = toToken.children[0];
	const initChildren = initToken.children;
	if (initToken.val !== '=' ||
	initChildren.length !== 2)
		return false;
	const startValueToken = initChildren[1];
	const startValue = evaluateToken(startValueToken);
	if (startValue !== 1)
		return false;
	const step = children[1];
	if (step.type !== ParseTreeTokenType.CODE_BLOCK) {
		if (step.type !== ParseTreeTokenType.STEP)
			return false;
		const stepChildren = step.children;
		const stepValue = evaluateToken(stepChildren[0]);
		if (stepValue !== 1)
			return false;
	}
	const codeBlock = getCodeBlockFromFor(forToken);
	if (codeBlock === undefined)
		return false;
	const counterVariableToken = initChildren[0];
	if (counterVariableToken.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	const varName = counterVariableToken.val.toLowerCase();
	if (findNestedUntranslatableVariableReference(varName, codeBlock, false))
		return false;

	return true;
};