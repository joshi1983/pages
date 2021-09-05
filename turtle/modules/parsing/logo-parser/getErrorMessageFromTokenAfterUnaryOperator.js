import { Operators } from '../Operators.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isEnd(token) {
	return token.type === ParseTreeTokenType.PROCEDURE_END_KEYWORD ||
		token.type === ParseTreeTokenType.LEAF && token.val.toLowerCase() === 'end';
}

function isProcedureStartKeyword(token) {
	if (token.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)
		return true;
	return token.type === ParseTreeTokenType.LEAF && token.val.toLowerCase() === 'to';
}

function tokenToDescription(token) {
	if (isEnd(token))
		return 'procedure end keyword';
	if (token.type === ParseTreeTokenType.NEW_LINE)
		return 'line break';
	else
		return '' + token.val;
}

export function getErrorMessageFromTokenAfterUnaryOperator(unaryToken, nextToken) {
	if (nextToken === null) {
		let msg = `The ${unaryToken.val} operator needs `;
		if (Operators.canBeUnary(unaryToken.val))
			msg += '1 or 2 inputs';
		else
			msg += '2 inputs';
		return msg;
	}
	if (isEnd(nextToken) || isProcedureStartKeyword(nextToken) || nextToken.type === ParseTreeTokenType.NEW_LINE || 
	nextToken.type === ParseTreeTokenType.LEAF && (nextToken.val === ')' || nextToken.val === ']'))
		return `Unary operator ${unaryToken.val} must be immediately before the value it operates on but found ${tokenToDescription(nextToken)}`;
};