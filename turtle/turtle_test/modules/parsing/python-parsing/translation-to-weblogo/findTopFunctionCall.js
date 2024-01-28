import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const functionNamesToPassThrough = new Set([
	'Pen',
	'Screen',
	'Turtle'
]);

export function findTopFunctionCall(token) {
	let result;
	while (token.children.length !== 0) {
		if (token.type === ParseTreeTokenType.PRINT)
			return token;
		else if (token.type === ParseTreeTokenType.FUNCTION_CALL) {
			if (functionNamesToPassThrough.has(token.val))
				result = token;
			else
				return token;
		}
		if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR && token.children.length === 2)
			token = token.children[1];
		else if (token.children.length !== 1)
			break;
		else
			token = token.children[0];
	}
	return result;
};