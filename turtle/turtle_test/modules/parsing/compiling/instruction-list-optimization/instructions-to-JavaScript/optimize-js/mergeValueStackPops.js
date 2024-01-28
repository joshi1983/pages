import { ArrayUtils } from '../../../../../ArrayUtils.js';
import { flatten } from '../../../../generic-parsing-utilities/flatten.js';
import { getAllDescendentsAsArray } from '../../../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getDecreaseAmountFromToken } from './getDecreaseAmountFromToken.js';
import { getDescendentsOfType } from '../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getDescendentsOfTypes } from '../../../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { isUsingContext } from './isUsingContext.js';
import { isValueStackPop } from './token-classifiers/isValueStackPop.js';
import { isValueStackLength } from './token-classifiers/isValueStackLength.js';
import { isValueStackLengthUpdate } from './token-classifiers/isValueStackLengthUpdate.js';
import { parse } from '../../../../js-parsing/parse.js';
import { parseTreeTokensToCode } from '../../../../js-parsing/parseTreeTokensToCode.js';
import { ParseTreeTokenType } from '../../../../js-parsing/ParseTreeTokenType.js';
import { removeSemicolonsImmediatelyAfter } from './removeSemicolonsImmediatelyAfter.js';
import { setValueStackDecreaseAmount } from './setValueStackDecreaseAmount.js';

function isValueStackLengthChange(token) {
	return isValueStackPop(token) ||
	isValueStackLengthUpdate(token);
}

function getPreviousValueStackLengthChange(token) {
	const children = token.parentNode.children;
	let index = children.indexOf(token);
	for (index--; index >= 0; index--) {
		const child = children[index];
		if (child.type !== ParseTreeTokenType.SEMICOLON) {
			if (isValueStackLengthChange(child))
				return child;
			return;
		}
	}
}

function getNextValueStackLengthChange(token) {
	const children = token.parentNode.children;
	let index = children.indexOf(token);
	for (index++; index < children.length; index++) {
		const child = children[index];
		if (child.type !== ParseTreeTokenType.SEMICOLON) {
			if (isValueStackLengthChange(child))
				return child;
			return;
		}
	}
}

function isOfInterest(token) {
	if (!isValueStackLengthChange(token))
		return false;
	if (getPreviousValueStackLengthChange(token) !== undefined)
		return false;
	return getNextValueStackLengthChange(token) !== undefined;
}

function processPopCluster(startToken) {
	let decreaseTotal = 0;
	const tokensToRemove = [];
	for (let token = startToken; token !== undefined; token = getNextValueStackLengthChange(token)) {
		decreaseTotal += getDecreaseAmountFromToken(token);
		ArrayUtils.pushAll(tokensToRemove, getAllDescendentsAsArray(token));
		if (token !== startToken)
			tokensToRemove.push(token);
	}
	setValueStackDecreaseAmount(startToken, decreaseTotal, tokensToRemove);
}

export function mergeValueStackPops(jsCode) {
	const parseResult = parse(jsCode);
	const pops = getDescendentsOfTypes(parseResult.root, [ParseTreeTokenType.ASSIGNMENT_OPERATOR, ParseTreeTokenType.FUNCTION_CALL]).
	filter(isOfInterest);
	if (pops.length === 0)
		return jsCode;

	pops.forEach(processPopCluster);

	return parseTreeTokensToCode(flatten(parseResult.root));
};