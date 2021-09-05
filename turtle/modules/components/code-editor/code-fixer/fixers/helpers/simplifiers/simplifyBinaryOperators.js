import { ArrayUtils } from
'../../../../../../ArrayUtils.js';
import { getAllDescendentsAsArray } from
'../../../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { isDefinitelyOne } from
'../../../../../../parsing/parse-tree-analysis/variable-data-types/token-evaluation/isDefinitelyOne.js';
import { isDefinitelyZero } from
'../../../../../../parsing/parse-tree-analysis/variable-data-types/token-evaluation/isDefinitelyZero.js';
import { mightHaveSideEffects } from
'../../../../../../parsing/parse-tree-analysis/mightHaveSideEffects.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/ParseTreeTokenType.js';

const binaryOperatorsOfInterest = new Set([
	'+', '-', '/', '*'
]);
export const constCommands = new Set(['goldenratio', 'pi']);

function isAddingZero(token) {
	if (token.val !== '+')
		return false;

	return token.children.some(isDefinitelyZero);
}

function isDividingByOne(token) {
	if (token.val !== '/')
		return false;

	const lastChild = token.children[1];
	return isDefinitelyOne(lastChild);
}

function isSubtractingZero(token) {
	if (token.val !== '-')
		return false;

	const lastChild = token.children[1];
	return isDefinitelyZero(lastChild);
}

function isOfInterest(token) {
	const children = token.children;
	if (!binaryOperatorsOfInterest.has(token.val) ||
	children.length !== 2)
		return false;

	for (const [isApplicable, _] of pairs) {
		if (isApplicable(token))
			return true;
	}
	if (token.val === '+' || token.val === '/')
		return false;

	if (token.val === '*') {
		return children.some(isDefinitelyZero) &&
		!children.some(mightHaveSideEffects);
	}

	for (const child of children) {
		if (child.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			if (!constCommands.has(child.val.toLowerCase()))
				return false;
		}
		else if (child.type !== ParseTreeTokenType.NUMBER_LITERAL &&
		child.type !== ParseTreeTokenType.VARIABLE_READ)
			return false;
	}
	const firstChild = children[0];
	const secondChild = children[1];
	if (firstChild.type !== secondChild.type)
		return false;

	if (firstChild.type === ParseTreeTokenType.VARIABLE_READ ||
	firstChild.type === ParseTreeTokenType.PARAMETERIZED_GROUP)
		return firstChild.val.toLowerCase() === secondChild.val.toLowerCase();

	return firstChild.val === secondChild.val;
}

function processAddingZero(cachedParseTree, opToken, fixLogger) {
	const zeroToken = opToken.children.filter(isDefinitelyZero)[0];
	const toRemove = getAllDescendentsAsArray(zeroToken);
	const zeroWasLast = opToken.children[1] === zeroToken;
	zeroToken.remove();
	opToken.removeSingleToken();
	toRemove.push(opToken, zeroToken);
	cachedParseTree.tokensRemoved(toRemove);
	let msg;
	if (zeroWasLast)
		msg = `Removed + 0 because something + 0 = something.  The + 0 doesn't do anything useful.`;
	else
		msg = `Removed 0 + because 0 + something = something.  The 0 + doesn't do anything useful.`;

	fixLogger.log(msg, opToken);
}

function removeSecondChildAndOperator(cachedParseTree, opToken, fixLogger, msg) {
	const lastChild = opToken.children[1];
	const toRemove = getAllDescendentsAsArray(lastChild);
	lastChild.remove();
	opToken.removeSingleToken();
	toRemove.push(opToken, lastChild);
	cachedParseTree.tokensRemoved(toRemove);
	fixLogger.log(msg,  opToken);
}

function processSubtractZero(cachedParseTree, opToken, fixLogger) {
	removeSecondChildAndOperator(cachedParseTree, opToken, fixLogger,
		`Removed - 0 because something - 0 = something.  The - 0 doesn't do anything useful.`);
}

function processDivideByOne(cachedParseTree, opToken, fixLogger) {
	removeSecondChildAndOperator(cachedParseTree, opToken, fixLogger,
		`Removed / 1 because something / 1 = something.  The / 1 doesn't do anything useful.`);
}

const pairs = [
	[isSubtractingZero, processSubtractZero],
	[isAddingZero, processAddingZero],
	[isDividingByOne, processDivideByOne]
];

export function simplifyBinaryOperators(cachedParseTree, fixLogger) {
	const ops = cachedParseTree.getTokensByType(ParseTreeTokenType.BINARY_OPERATOR).
		filter(isOfInterest);
	ops.forEach(function(opToken) {
		if (opToken.parentNode === null)
			return;
			// previous mutation in this fixer must have already removed opToken.
			// No need to fix a removed token so just return.

		for (const [isApplicable, process] of pairs) {
			if (isApplicable(opToken)) {
				process(cachedParseTree, opToken, fixLogger);
				return;
			}
		}
		const oldVal = opToken.val;
		const toRemove = [];
		for (const child of opToken.children) {
			ArrayUtils.pushAll(toRemove, getAllDescendentsAsArray(child));
			toRemove.push(child);
			child.remove();
		}
		cachedParseTree.tokensRemoved(toRemove);
		if (opToken.val === '-' || opToken.val === '*') {
			opToken.val = 0; // For example, :x - :x = 0
				// Also, :x * 0 = 0
		}
		opToken.originalString = '' + opToken.val;
		opToken.type = ParseTreeTokenType.NUMBER_LITERAL;
		cachedParseTree.tokenTypeChanged(opToken, ParseTreeTokenType.BINARY_OPERATOR);
		let reason;
		if (oldVal === '*')
			reason = 'anything * 0 is 0.';
		else
			reason = 'the operation cancels out';

		fixLogger.log(`Replaced ${oldVal} operator with ${opToken.val} because ${reason}.`,  opToken);
	});
	return ops.length !== 0;
};