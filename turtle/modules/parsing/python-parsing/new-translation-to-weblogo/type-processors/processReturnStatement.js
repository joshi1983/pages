import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

function returnsNone(token) {
	return token.children.length === 1 &&
		token.children[0].type === ParseTreeTokenType.NONE;
}

export function processReturnStatement(token, result, cachedParseTree) {
	result.processCommentsUpToToken(token);
	if (token.children.length === 0 || returnsNone(token))
		result.append('\nstop\n');
	else {
		result.append('output ');
		processToken(token.children[0], result, cachedParseTree);
		result.append('\n');
	}
};