import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

export function processIdentifier(token, result, settings) {
	const parent = token.parentNode;
	const children = token.children;
	if (children.length === 0 || parent.type === ParseTreeTokenType.ARG_LIST)
		result.append(':' + token.val + ' ');
	else {
		const firstChild = children[0];
		processToken(firstChild, result, settings);
	}
};