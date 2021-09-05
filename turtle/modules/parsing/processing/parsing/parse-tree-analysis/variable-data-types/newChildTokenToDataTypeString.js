import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function newChildTokenToDataTypeString(token) {
	const children = token.children;
	if (children.length === 0)
		return;
	let suffix = '';
	if (token.type === ParseTreeTokenType.ARRAY_INSTANCE_EXPRESSION)
		suffix = '[]'.repeat(token.children.length - 1);
	const typeToken = children[0];
	if (typeToken.type === ParseTreeTokenType.IDENTIFIER) {
		let result = '';
		let tok = token;
		while (tok !== undefined) {
			if (typeof tok.val === 'string')
				result += tok.val;
			tok = tok.children[0];
		}
		return result + suffix;
	}
};