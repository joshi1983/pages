import { convertChildren } from './helpers/convertChildren.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function fixBracketWrappedArgumentLists(token) {
	let result = false;
	const prev = token.getPreviousSibling();
	const next = token.getNextSibling();
	const parent = token.parentNode;
	if (token.type === ParseTreeTokenType.ARGUMENT_LIST &&
	prev !== null &&
	prev.type === ParseTreeTokenType.CURVED_LEFT_BRACKET &&
	next !== null &&
	next.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET &&
	parent !== null &&
	parent.type === ParseTreeTokenType.FUNCTION_CALL) {
		token.removeSingleToken();
		return true;
	}
	if (convertChildren(token, fixBracketWrappedArgumentLists))
		result = true;
	return result;
};