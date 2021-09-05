import { Command } from
'../../../../../../parsing/Command.js';
import { getSortedFirstDescendentTokenOf } from
'../../../../../../parsing/generic-parsing-utilities/getSortedFirstDescendentTokenOf.js';
import { getSortedLastDescendentTokenOf } from
'../../../../../../parsing/generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { ParseTreeToken } from
'../../../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/ParseTreeTokenType.js';

const renameMap1 = new Map([
	['cos', 'radCos'],
	['sin', 'radSin'],
	['tan', 'radTan']
]);
const renameMap2 = new Map([
	['arcCos', 'radArcCos'],
	['arcSin', 'radArcSin'],
	['arcTan', 'radArcTan'],
	['arcTan2', 'radArcTan2']
]);

export { renameMap1, renameMap2 };

const typesNotNeedingCurvedBrackets = new Set([
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.LIST
]);

function areBracketsNeeded(token) {
	if (token.children.length === 0)
		return false;

	if (typesNotNeedingCurvedBrackets.has(token.type))
		return false;

	return true;
}

function multiplyByFactor(token, factor, cachedParseTree) {
	if (token.type === ParseTreeTokenType.NUMBER_LITERAL) {
		token.val *= factor;
		token.originalString = '' + token.val;
		return token;
	}
	const lastToken = token.children.length === 0 ? token : getSortedLastDescendentTokenOf(token);
	const multiply = new ParseTreeToken('*', null,
		lastToken.lineIndex, lastToken.colIndex + 2,
		ParseTreeTokenType.BINARY_OPERATOR);
	const factorToken = new ParseTreeToken(factor, null,
		multiply.lineIndex, multiply.colIndex + 1,
		ParseTreeTokenType.NUMBER_LITERAL,
		'' + factor);
	token.parentNode.replaceChild(token, multiply);
	token.remove();
	multiply.appendChild(token);
	multiply.appendChild(factorToken);
	cachedParseTree.tokensAdded([factorToken, multiply]);
	if (areBracketsNeeded(token)) {
		const firstToken = getSortedFirstDescendentTokenOf(token, true);
		const expression = new ParseTreeToken(null, null,
			firstToken.lineIndex, firstToken.colIndex - 1,
			ParseTreeTokenType.CURVED_BRACKET_EXPRESSION);
		const openBracket = new ParseTreeToken('(', null,
			expression.lineIndex, expression.colIndex,
			ParseTreeTokenType.LEAF);
		const closeBracket = new ParseTreeToken(')', null,
			multiply.lineIndex, multiply.colIndex - 1,
			ParseTreeTokenType.LEAF);
		expression.appendChild(openBracket);
		token.parentNode.replaceChild(token, expression);
		token.remove();
		expression.appendChild(token);
		expression.appendChild(closeBracket);
		cachedParseTree.tokensAdded([closeBracket, expression, openBracket]);
	}
	return multiply;
}

function convertFromDegrees(degreesToken, cachedParseTree) {
	const factor = Math.PI / 180;
	multiplyByFactor(degreesToken, factor, cachedParseTree);
}

function convertFromRadians(radiansToken, cachedParseTree) {
	const factor = 180 / Math.PI;
	multiplyByFactor(radiansToken, factor, cachedParseTree);
	// FIXME: wrap the multiply expression with curved brackets if necessary to control order of operation.
}

function isOfInterest(token) {
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return false;

	if (!renameMap1.has(info.primaryName) &&
	!renameMap2.has(info.primaryName))
		return false;

	return true;
}

export function simplifyWithRadians(cachedParseTree, fixLogger) {
	const calls = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	calls.forEach(function(call) {
		const oldVal = call.val;
		const info = Command.getCommandInfo(call.val);
		const primaryName = info.primaryName;
		if (renameMap1.has(primaryName)) {
			call.val = renameMap1.get(primaryName);
			convertFromDegrees(call.children[0], cachedParseTree);
		}
		else {
			call.val = renameMap2.get(primaryName);
			convertFromRadians(call, cachedParseTree);
		}
		fixLogger.log(`Renamed ${oldVal} to ${call.val} because trigonometry functions using radians execute a little faster.`, call);
	});
};