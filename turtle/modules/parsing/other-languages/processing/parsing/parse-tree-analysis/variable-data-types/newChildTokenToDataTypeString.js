import { getDataTypeStringFromTypeToken } from './getDataTypeString.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function newChildTokenToDataTypeString(token) {
	const children = token.children;
	if (children.length === 0)
		return;
	let suffix = '';
	if (token.type === ParseTreeTokenType.ARRAY_INSTANCE_EXPRESSION)
		suffix = '[]'.repeat(token.children.length - 1);
	const typeToken = children[0];
	if (typeToken.type === ParseTreeTokenType.IDENTIFIER ||
	typeToken.type === ParseTreeTokenType.EXPRESSION_DOT) {
		let result = getDataTypeStringFromTypeToken(typeToken);
		return result + suffix;
	}
};