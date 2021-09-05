import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function processComment(token, result) {
	if (token.type === ParseTreeTokenType.SINGLE_LINE_COMMENT)
		result.append(' ;' + token.val.substring(2) + '\n');
	else {
		for (let line of token.val.split('\n')) {
			if (line.startsWith('/*'))
				line = line.substring(2);
			if (line.endsWith('*/'))
				line = line.substring(0, line.length - 2);
			result.append(' ;' + line + '\n');
		}
	}
};