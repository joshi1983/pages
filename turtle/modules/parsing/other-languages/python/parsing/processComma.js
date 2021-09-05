import { createTokenFromToken } from './createTokenFromToken.js';
import { mightBeDataValueToken } from './mightBeDataValueToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const typesExpectingCommas = new Set([
	ParseTreeTokenType.ARGUMENT_LIST,
	ParseTreeTokenType.COMMA_EXPRESSION,
	ParseTreeTokenType.GLOBAL,
	ParseTreeTokenType.LIST_LITERAL,
	ParseTreeTokenType.TUPLE_LITERAL
]);

const badPreviousTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.ELIF,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.FOR_LOOP,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.IF_STATEMENT,
	ParseTreeTokenType.LONG_STRING_LITERAL,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.UNARY_OPERATOR,
	ParseTreeTokenType.WHILE_LOOP,
]);

function shouldAddCommaExpression(prev) {
	if (typesExpectingCommas.has(prev.type))
		return false;
	const children = prev.children;
	if (children.length === 0)
		return false;
	const lastChild = children[children.length - 1];
	if (!mightBeDataValueToken(lastChild))
		return false;
	return true;
}

function isGoodPrevious(prev) {
	if (badPreviousTypes.has(prev.type))
		return false;
	
	return true;
}

function getGoodPrevious(prev) {
	let tok = prev;
	while (tok !== undefined && !isGoodPrevious(tok))
		tok = tok.children[tok.children.length - 1];
	if (tok !== undefined)
		return tok;
	
	return prev;
}

export function processComma(prev, next) {
	prev = getGoodPrevious(prev);
	if (prev.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
		// A curved bracket expression can not have a comma as a direct child.
		// A tuple can.
		// For that reason, convert the curved bracket expression to a tuple literal.
		prev.type = ParseTreeTokenType.TUPLE_LITERAL;
	}
	if (shouldAddCommaExpression(prev)) {
		const newToken = createTokenFromToken(null, prev, ParseTreeTokenType.COMMA_EXPRESSION);
		const children = prev.children;
		const lastChild = children[children.length - 1];
		if (lastChild !== undefined) {
			prev.replaceChild(lastChild, newToken);
			newToken.appendChild(lastChild);
		}
		newToken.appendChild(next);
		prev.appendChild(newToken);
		return newToken;
	}
	prev.appendChild(next);
	return prev;
};