import { evaluateToken } from
'../../evaluation/evaluateToken.js';
import { getDescendentsOfTypes } from
'../../../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function loopToCondition(token) {
	if (token.type === ParseTreeTokenType.WHILE)
		return token.children[0];
	if (token.type === ParseTreeTokenType.DO) {
		const loopToken = token.children[1];
		if (loopToken === undefined)
			return;
		const untilToken = loopToken.children[0];
		if (untilToken === undefined)
			return;
		return untilToken.children[0];
	}
	if (token.type === ParseTreeTokenType.DO_WHILE ||
	token.type === ParseTreeTokenType.DO_UNTIL) {
		const conditionParentToken = token.children[1];
		if (conditionParentToken !== undefined)
			return conditionParentToken.children[0];
	}
}

function loopToCodeBlock(token) {
	if (token.type === ParseTreeTokenType.DO)
		return token.children[0];
	if (token.type === ParseTreeTokenType.WHILE)
		return token.children[1];
	if (token.type === ParseTreeTokenType.DO_WHILE ||
	token.type === ParseTreeTokenType.DO_UNTIL)
		return token.children[2];
}

function isOfInterest(token) {
	const children = token.children;
	if (children.length === 0)
		return false;
	const condition = loopToCondition(token);
	if (condition === undefined)
		return false;
	let conditionVal = evaluateToken(condition);
	if (conditionVal === undefined)
		return false; // Not interested because it is not for sure an infinite loop.

	if (token.type === ParseTreeTokenType.DO_UNTIL ||
	token.type === ParseTreeTokenType.DO) {
		if (!!conditionVal)
			return false;
	}
	else if (!conditionVal)
		return false;

	const codeBlock = loopToCodeBlock(token);
	if (codeBlock !== undefined && codeBlock.type === ParseTreeTokenType.CODE_BLOCK) {
		if (codeBlock.children.length === 0)
			return true; // interested because there are no instructions in the infinite loop.
	}
	return false;
}

export function removeTrivialInfiniteLoops(root) {
	const loops = getDescendentsOfTypes(root, [ParseTreeTokenType.DO,
	ParseTreeTokenType.DO_UNTIL, ParseTreeTokenType.DO_WHILE, ParseTreeTokenType.WHILE]).
		filter(isOfInterest);
	loops.forEach(function(token) {
		token.remove();
	});
	return loops.length !== 0;
};