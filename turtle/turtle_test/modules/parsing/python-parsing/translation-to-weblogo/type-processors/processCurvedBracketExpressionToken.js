import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';

const typesToRemoveBrackets = new Set([
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.LIST_LITERAL,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.TUPLE_LITERAL
]);

function shouldRemoveBrackets(token) {
	if (typesToRemoveBrackets.has(token.type))
		return true;
	return false;
}

export function processCurvedBracketExpressionToken(token, result, cachedParseTree) {
	if (token.children.length !== 3)
		throw new Error(`Expected 3 children but got ${token.children.length}`);
	if (shouldRemoveBrackets(token.children[1]))
		processToken(token.children[1], result, cachedParseTree);
	else {
		result.append('(');
		processToken(token.children[1], result, cachedParseTree);
		result.append(')');
	}
};