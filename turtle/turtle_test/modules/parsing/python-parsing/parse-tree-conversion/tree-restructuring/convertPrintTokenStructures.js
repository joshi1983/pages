import { convertChildren } from './helpers/convertChildren.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function convertPrintTokenStructures(token) {
	let result = false;
	if (token.type === ParseTreeTokenType.PRINT &&
	token.children.length > 1 &&
	token.children[0].val === 'print') {
		token.val = 'print';
		token.type = ParseTreeTokenType.FUNCTION_CALL;
		token.removeChild(token.children[0]);
		result = true;
	}
	if (convertChildren(token, convertPrintTokenStructures))
		result = true;
	return result;
};