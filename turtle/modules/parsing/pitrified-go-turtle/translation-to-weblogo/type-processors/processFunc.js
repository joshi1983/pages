import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from
'./processToken.js';
import { processTokens } from
'./helpers/processTokens.js';

export function processFunc(token, result, settings) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	if (children.length !== 0) {
		result.append('\nto ');
		const first = children[0];
		if (first.type === ParseTreeTokenType.IDENTIFIER)
			result.append(first.val);
		else
			processToken(first, result, settings);
		result.append(' ');
		if (children.length > 1) {
			processToken(children[1], result, settings);
			if (children.length > 2) {
				result.append('\n');
				processTokens(children[2].children, result, settings);
			}
		}
		result.append('\nend\n');
	}
};