import { convertChildren } from './helpers/convertChildren.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const possiblePrintTypes = new Set([
ParseTreeTokenType.FUNCTION_CALL,
ParseTreeTokenType.IDENTIFIER
]);

export function convertSubscriptsToChildrenOfIdentifiers(token) {
	let result = false;
	if (token.type === ParseTreeTokenType.SUBSCRIPT &&
	token.parentNode !== null) {
		if (token.parentNode.type === ParseTreeTokenType.UNRECOGNIZED &&
		token.parentNode.children.length > 1) {
			const parent = token.parentNode;
			const index = parent.children.indexOf(token);
			if (index > 0 && parent.children[index - 1].type === ParseTreeTokenType.IDENTIFIER) {
				const previousSibling = parent.children[index - 1];
				previousSibling.appendChild(token);
				result = true;
			}
		}
		else if (token.parentNode.val === 'print' &&
		possiblePrintTypes.has(token.parentNode.type) &&
		token.parentNode.children.length === 1) {
			token.type = ParseTreeTokenType.LIST_LITERAL;
			result = true;
		}
	}
	if (convertChildren(token, convertSubscriptsToChildrenOfIdentifiers))
		result = true;

	return result;
};