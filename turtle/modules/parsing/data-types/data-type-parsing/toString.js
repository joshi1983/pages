import { DataTypeTokenType } from './DataTypeTokenType.js';
import { StringBuffer } from '../../../StringBuffer.js';

export function toString(token) {
	const s = new StringBuffer();
	const children = token.children;
	if (token.val !== null)
		s.append(token.val);
	if (token.type === DataTypeTokenType.ASSIGNMENT &&
	token.children.length === 2) {
		return token.children[0].val + '=' + token.children[1].val;
	}
	if (token.type === DataTypeTokenType.ATTRIBUTES_EXPRESSION)
		s.append('(');
	else if (token.type === DataTypeTokenType.TEMPLATE_EXPRESSION)
		s.append('<');
	if (children.length !== 0) {
		for (let i = 0; i < children.length; i++) {
			if (i !== 0) {
				if (token.type === DataTypeTokenType.TEMPLATE_EXPRESSION ||
				token.type === DataTypeTokenType.TREE_ROOT)
					s.append('|');
				else if (token.type !== DataTypeTokenType.NAME)
					s.append(',');
			}
			s.append(toString(children[i]));
		}
	}
	if (token.type === DataTypeTokenType.ATTRIBUTES_EXPRESSION)
		s.append(')');
	else if (token.type === DataTypeTokenType.TEMPLATE_EXPRESSION)
		s.append('>');
	return s.toString();
};