import { convertChildren } from './helpers/convertChildren.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const restrictedParentTypes = new Set([
ParseTreeTokenType.FUNCTION_DEFINITION
]);

/*
Similar to convertMethodCallsToFunctionCalls
except we're dealing with function calls only.
In other words, functions that aren't tied to classes or
properties of objects.
*/
export function convertSomeIdentifiersToFunctionCalls(token) {
	let result = false;
	if (token.type === ParseTreeTokenType.IDENTIFIER &&
	token.children.length === 0 &&
	!restrictedParentTypes.has(token.parentNode.type) &&
	token.parentNode.children.length > 1 &&
	token.parentNode.children.indexOf(token) < token.parentNode.children.length - 1
	) {
		const parent = token.parentNode;
		const index = parent.children.indexOf(token);
		const nextSibling = parent.children[index + 1];
		if (nextSibling.type === ParseTreeTokenType.UNRECOGNIZED &&
		nextSibling.children.length >= 2 &&
		nextSibling.children[0].type === ParseTreeTokenType.CURVED_LEFT_BRACKET &&
		nextSibling.children[nextSibling.children.length - 1].type === ParseTreeTokenType.CURVED_RIGHT_BRACKET) {
			while (nextSibling.children.length !== 0) {
				token.appendChild(nextSibling.children[0]);
			}
			parent.removeChild(nextSibling);
			token.type = ParseTreeTokenType.FUNCTION_CALL;
			result = true;
		}
	}
	if (convertChildren(token, convertSomeIdentifiersToFunctionCalls))
		result = true;
	return result;
};