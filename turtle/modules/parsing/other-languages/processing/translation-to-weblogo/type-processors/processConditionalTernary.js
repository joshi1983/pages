import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

const ignoredTypes = new Set([
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.QUESTION_MARK
]);

export function processConditionalTernary(token, result, settings) {
	const children = token.children.filter(t => !ignoredTypes.has(t.type));
	if (children.length === 2) {
		// weird case but let's handle it as well as possible anyway.
		result.append('if ');
		processToken(children[0], result, settings);
		result.append(' [ ');
		processToken(children[1], result, settings);
		result.append(' ] ');
	}
	else if (children.length === 3) {
		// the normal case
		result.append('ifelse ');
		for (const child of children) {
			processToken(child, result, settings);
			result.append(' ');
		}
	}
};