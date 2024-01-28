import { flatten } from '../../../../generic-parsing-utilities/flatten.js';
import { getAllDescendentsAsArray } from '../../../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getSortedLastDescendentTokenOf } from '../../../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { insertColIndexSpanAt } from '../../../../generic-parsing-utilities/insertColIndexSpanAt.js';
import { isLastValueStackElementExpression } from './token-classifiers/isLastValueStackElementExpression.js';
import { isLastValueStackElementAssignment } from './token-classifiers/isLastValueStackElementAssignment.js';
import { isSafeWithoutBrackets } from './isSafeWithoutBrackets.js';
import { isValueStackLength } from './token-classifiers/isValueStackLength.js';
import { isValueStackPop } from './token-classifiers/isValueStackPop.js';
import { isValueStackPush } from './token-classifiers/isValueStackPush.js';
import { parse } from '../../../../js-parsing/parse.js';
import { ParseTreeToken } from '../../../../generic-parsing-utilities/ParseTreeToken.js';
import { parseTreeTokensToCode } from '../../../../js-parsing/parseTreeTokensToCode.js';
import { ParseTreeTokenType } from '../../../../js-parsing/ParseTreeTokenType.js';
import { removeSemicolonsImmediatelyAfter } from './removeSemicolonsImmediatelyAfter.js';
import { setLineIndexForAllDescendents } from './setLineIndexForAllDescendents.js';
import { wrapInCurvedBrackets } from './wrapInCurvedBrackets.js';

function getPreviousTokenOfInterest(token) {
	const parent = token.parentNode;
	const children = parent.children;
	let index = children.indexOf(token);
	for (index--;index >= 0;index--) {
		const prev = children[index];
		if (prev.type !== ParseTreeTokenType.SEMICOLON) {
			if (isLastValueStackElementAssignment(prev) ||
			isValueStackPush(prev))
				return prev;
			return;
		}
	}
}

function canBeMoved(fromValueToken) {
	if (fromValueToken.type === ParseTreeTokenType.NUMBER_LITERAL)
		return true;
	if (isBinaryStartingWithLastValueStackExpression(fromValueToken)) {
		return true;
	}
	return false;
}

function isOfInterest(token) {
	if (isLastValueStackElementAssignment(token)) {
		if (!canBeMoved(token.children[1]))
			return false;
		const prev = getPreviousTokenOfInterest(token);
		if (prev !== undefined) {
			return true;
		}
	}
	return false;
}

function pushTokenToReplacableToken(token) {
	const argList = token.children[1];
	return argList.children[argList.children.length - 2];
}

function isUnmovableDescendentToken(token) {
	if (isValueStackLength(token) ||
	isValueStackPop(token))
		return true;
	return false;
}

function containsUnmovableToken(token) {
	const tokens = getAllDescendentsAsArray(token);
	tokens.push(token);
	return tokens.some(isUnmovableDescendentToken);
}

function isBinaryStartingWithLastValueStackExpression(token) {
	if (token.type !== ParseTreeTokenType.BINARY_OPERATOR ||
	token.children.length !== 2)
		return false;
	if (!isLastValueStackElementExpression(token.children[0]))
		return false;
	if (containsUnmovableToken(token.children[1]))
		return false;
	return true;
}

function merge(token) {
	const prev = getPreviousTokenOfInterest(token);
	removeSemicolonsImmediatelyAfter(prev);
	let valueToken;
	if (isValueStackPush(prev)) {
		valueToken = pushTokenToReplacableToken(prev);
	}
	else if (prev.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		valueToken = prev.children[1];
	const fromToken = token.children[1];
	if (fromToken.type === ParseTreeTokenType.NUMBER_LITERAL) {
		valueToken.type = ParseTreeTokenType.NUMBER_LITERAL;
		valueToken.val = fromToken.val;
		valueToken.originalString = undefined;
		valueToken.children = []; // remove any children.
	}
	else if (fromToken.type === ParseTreeTokenType.BINARY_OPERATOR) {
		if (isBinaryStartingWithLastValueStackExpression(fromToken)) {
			if (!isSafeWithoutBrackets(valueToken)) {
				valueToken = wrapInCurvedBrackets(valueToken);
			}
			const lastDescendentOfValueToken = getSortedLastDescendentTokenOf(valueToken);
			insertColIndexSpanAt(lastDescendentOfValueToken, 100000);
			// hopefully 100000 characters is wider than the width needed for the newly inserted content.
			const newOperatorToken = new ParseTreeToken(fromToken.val, lastDescendentOfValueToken.lineIndex,
				lastDescendentOfValueToken.colIndex + 1, ParseTreeTokenType.BINARY_OPERATOR);
			const newOperandToken = token.children[1].children[1].cloneWithDescendents();
			setLineIndexForAllDescendents(newOperandToken, lastDescendentOfValueToken.lineIndex, lastDescendentOfValueToken.colIndex);
			const argList = valueToken.parentNode;
			argList.replaceChild(valueToken, newOperatorToken);
			newOperatorToken.appendChild(valueToken);
			newOperatorToken.appendChild(newOperandToken);
		}
	}

	token.remove();
}

export function mergeValueStackLastMutations(jsCode) {
	const parseResult = parse(jsCode);
	const allTokens = flatten(parseResult.root);
	const tokens = allTokens.filter(isOfInterest);
	if (tokens.length === 0)
		return jsCode;
	tokens.forEach(merge);
	return parseTreeTokensToCode(flatten(parseResult.root));
};