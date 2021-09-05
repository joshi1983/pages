import { addToken } from './addToken.js';
import { adjustToken } from './adjustToken.js';
import { endsWithCurlyRightBracket } from './endsWithCurlyRightBracket.js';
import { isTokenBeforeClassMethodCodeBlock } from './isTokenBeforeClassMethodCodeBlock.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const curlyBracketGroupTypes = new Set([
	ParseTreeTokenType.CLASS_BODY,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
	ParseTreeTokenType.INTERFACE_BODY
]);

const badResultTypes = new Set([
	ParseTreeTokenType.CATCH,
	ParseTreeTokenType.CLASS,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.ELSE_IF,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.METHOD,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.WHILE,
]);

function startsWithCurlyLeftBracket(token) {
	if (token.children.length === 0)
		return false;
	const first = token.children[0];
	return first.type === ParseTreeTokenType.CURLY_LEFT_BRACKET;
}

function endsWithCurlyLeftBracket(token) {
	if (token.children.length === 0)
		return false;
	const last = token.children[token.children.length - 1];
	return last.type === ParseTreeTokenType.CURLY_RIGHT_BRACKET;
}

function getNearestCurlyBracketGroupToken(token) {
	while (token !== null && (!curlyBracketGroupTypes.has(token.type) ||
	!startsWithCurlyLeftBracket(token) || endsWithCurlyLeftBracket(token)))
		token = token.parentNode;
	if (token !== null && token.parentNode.type === ParseTreeTokenType.CODE_BLOCK &&
	!startsWithCurlyLeftBracket(token))
		return token.parentNode;

	return token;
}

function isGoodResultToken(token) {
	if (token.type === ParseTreeTokenType.CODE_BLOCK ||
	token.type === ParseTreeTokenType.CURLY_BRACKET_EXPRESSION ||
	token.type === ParseTreeTokenType.CLASS_BODY ||
	token.type === ParseTreeTokenType.INTERFACE_BODY) {
		if (token.children[0].type !== ParseTreeTokenType.CURLY_LEFT_BRACKET)
			return false;
		return !endsWithCurlyRightBracket(token);
	}
	if (token.type === ParseTreeTokenType.IDENTIFIER) {
		const firstChild = token.children[0];
		if (firstChild.type === ParseTreeTokenType.ARG_LIST &&
		isTokenBeforeClassMethodCodeBlock(firstChild))
			return false;
	}
	return !badResultTypes.has(token.type);
}

function getGoodResultFromGroupToken(token) {
	while (!isGoodResultToken(token))
		token = token.parentNode;
	return token;
}

export function processCurlyRightBracket(previousToken, nextToken) {
	adjustToken(previousToken);
	const nearestParent = getNearestCurlyBracketGroupToken(previousToken);
	if (nearestParent !== null) {
		nearestParent.appendChild(nextToken);
		return getGoodResultFromGroupToken(nearestParent);
	}
	else
		addToken(previousToken, nextToken);
};