import { convertChildren } from './helpers/convertChildren.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function convertSomeTupleLiteralsToCurvedBracketExpressions(token) {
	let result = false;
	if (token.type === ParseTreeTokenType.TUPLE_LITERAL &&
	token.children[1].type !== ParseTreeTokenType.UNRECOGNIZED &&
	token.children.length === 3) {
		token.type = ParseTreeTokenType.CURVED_BRACKET_EXPRESSION;
		result = true;
	}
	if (convertChildren(token, convertSomeTupleLiteralsToCurvedBracketExpressions))
		result = true;
	return result;
};