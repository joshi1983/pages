import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';
import { shouldUseStrCommand } from '../helpers/shouldUseStrCommand.js';

export function combineArgsIntoString(token, result, options) {
	const children = token.children.filter(t => t.type !== ParseTreeTokenType.SEMICOLON);
	if (children.length === 0)
		result.append(` '' `);
	else if (children.length === 1)
		processToken(children[0], result, options);
	else if (children.length === 2) {
		result.append(' word ');
		const first = children[0];
		const last = children[1];
		if (shouldUseStrCommand(first, options))
			result.append(' str ');
		processToken(first, result, options);
		result.append(' ');
		if (shouldUseStrCommand(last, options))
			result.append(' str ');
		processToken(last, result, options);
		result.append(' ');
	}
	else {
		result.append(' ( word ');
		for (let i = 0; i < children.length; i ++) {
			const child = children[i];
			if (i !== 0 && i < children.length - 1) {
				if (child.val === ',') {
					result.append(` '\t' `);
					continue;
				}
			}
			if (shouldUseStrCommand(child, options) && child.type !== ParseTreeTokenType.COMMA)
				result.append(' str ');

			processToken(child, result, options);
			result.append(' ');
		}
		result.append(' ) ');
	}
};