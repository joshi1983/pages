import { convertChildren } from './helpers/convertChildren.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const typesForPossibleReturnValues = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.LIST_LITERAL,
	ParseTreeTokenType.NONE,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.TUPLE_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR
]);

export function convertReturnStructures(token) {
	let result = false;
	if (token.type === ParseTreeTokenType.RETURN &&
	token.children.length === 0 &&
	token.parentNode !== null &&
	token.parentNode.children.length > 1 &&
	token.parentNode.children.indexOf(token) === 0) {
		const parent = token.parentNode;
		const index = parent.children.indexOf(token);
		const potentialChild = parent.children[index + 1];
		if (typesForPossibleReturnValues.has(potentialChild.type)) {
			token.appendChild(potentialChild);
			result = true;
		}
	}
	if (convertChildren(token, convertReturnStructures))
		result = true;
	return result;
};