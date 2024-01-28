import { convertChildren } from './helpers/convertChildren.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function convertSomeFunctionCallsToIdentifiers(token) {
	let result = false;
	if (token.type === ParseTreeTokenType.FUNCTION_CALL &&
	token.children.length === 1 &&
	token.children[0].type === ParseTreeTokenType.SUBSCRIPT &&
	token.val !== 'print') {
		token.type = ParseTreeTokenType.IDENTIFIER;
		result = true;
	}
	if (convertChildren(token, convertSomeFunctionCallsToIdentifiers))
		result = true;
	return result;
};