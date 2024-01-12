import { flatten } from '../../../../generic-parsing-utilities/flatten.js';
import { getAllDescendentsAsArray } from '../../../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getSortedFirstTokenFromArray } from '../../../../generic-parsing-utilities/getSortedFirstTokenFromArray.js';
import { isLastValueStackElementExpression } from './token-classifiers/isLastValueStackElementExpression.js';
import { isLastValueStackElementAssignment } from './token-classifiers/isLastValueStackElementAssignment.js';
import { isValueStackPush } from './token-classifiers/isValueStackPush.js';
import { parse } from '../../../../js-parsing/parse.js';
import { ParseTreeToken } from '../../../../generic-parsing-utilities/ParseTreeToken.js';
import { parseTreeTokensToCode } from '../../../../js-parsing/parseTreeTokensToCode.js';
import { ParseTreeTokenType } from '../../../../js-parsing/ParseTreeTokenType.js';
import { removeSemicolonsImmediatelyAfter } from './removeSemicolonsImmediatelyAfter.js';

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
	if (fromValueToken.type === ParseTreeTokenType.BINARY_OPERATOR) {
		
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

function setLineIndexForAllDescendents(token, lineIndex, colIndex) {
	const descendents = getAllDescendentsAsArray(token);
	descendents.push(token);
	const firstToken = getSortedFirstTokenFromArray(descendents);
	const colIndexOffset = colIndex - firstToken.colIndex;
	descendents.forEach(function(t) {
		t.lineIndex = lineIndex;
		t.colIndex += colIndexOffset;
	});
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
		const newOperatorToken = new ParseTreeToken(fromToken.val, valueToken.lineIndex, valueToken.colIndex, ParseTreeTokenType.BINARY_OPERATOR);
		const newOperandToken = valueToken.children[1].cloneWithDescendents();
		console.log(`newOperandToken.val = ${newOperandToken.val}`);
		setLineIndexForAllDescendents(newOperandToken, valueToken.lineIndex, valueToken.colIndex);
		const argList = valueToken.parentNode;
		argList.replaceChild(valueToken, newOperatorToken);
		newOperatorToken.appendChild(valueToken);
		newOperatorToken.appendChild(newOperandToken);
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