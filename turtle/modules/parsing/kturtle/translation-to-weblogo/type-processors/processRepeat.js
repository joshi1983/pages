import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

export function processRepeat(token, result) {
	result.processCommentsUpToToken(token);
	result.append('repeat ');
	if (token.children.length === 0) {
		result.append('1 []');
	}
	else if (token.children.length === 1) {
		const firstChild = token.children[0];
		if (firstChild.type === ParseTreeTokenType.CODE_BLOCK) {
			result.append('1 ');
			processToken(firstChild, result);
		}
		else {
			processToken(firstChild, result);
			if (!result.endsWithAndNotAcomment(' '))
				result.append(' ');
			result.append('[]');
		}
	}
	else {
		token.children.forEach(function(child) {
			processToken(child, result);
		});
	}
};