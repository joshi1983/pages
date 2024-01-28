import { StringBuffer } from '../../../StringBuffer.js';

export function toString(token) {
	const s = new StringBuffer();
	const children = token.children;
	if (token.val !== null)
		s.append(token.val);
	if (children.length !== 0) {
		if (token.val !== null) {
			s.append('<');
		}
		for (let i = 0; i < children.length; i++) {
			if (i !== 0)
				s.append('|');
			s.append(toString(children[i]));
		}
		if (token.val !== null)
			s.append('>');
	}
	return s.toString();
};