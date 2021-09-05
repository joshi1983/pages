import { CommandCalls } from
'../../../../../../parsing/parse-tree-analysis/CommandCalls.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/ParseTreeTokenType.js';

const oppositeOperators = [
	['>', '<='],
	['<', '>='],
	['=', '<>'],
];
const notMap = new Map();
for (const pair of oppositeOperators) {
	notMap.set(pair[0], pair[1]);
	notMap.set(pair[1], pair[0]);
}

function getOperatorToken(notToken) {
	let result = notToken.children[0];
	while (result !== undefined &&
	result.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
		result = result.children[1];
	
	if (result === undefined ||
	result.type !== ParseTreeTokenType.BINARY_OPERATOR)
		return;

	return result;
}

function isOfInterest(token) {
	if (!CommandCalls.tokenMatchesPrimaryName(token, 'not'))
		return false;

	const operatorToken = getOperatorToken(token);
	if (operatorToken === undefined)
		return false;

	if (!notMap.has(operatorToken.val))
		return false;

	return true;
}

export function simplifyNotBinaryOperators(cachedParseTree, fixLogger) {
	const nots = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	nots.forEach(function(notToken) {
		const operatorToken = getOperatorToken(notToken);
		const oldTokenValue = operatorToken.val;
		operatorToken.val = notMap.get(oldTokenValue);
		notToken.removeSingleToken();
		cachedParseTree.tokenRemoved(notToken);
		cachedParseTree.tokenValueChanged(operatorToken, oldTokenValue);
		fixLogger.log(`Removed not command call and replaced operator ${oldTokenValue} with ${operatorToken.val} to simplify the code.`, notToken);
	});
};