import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processTokens } from
'./helpers/processTokens.js';

function shouldProcess(token) {
	return token.type !== ParseTreeTokenType.IDENTIFIER;
}

export function processModule(token, result) {
	result.processCommentsUpToToken(token);
	processTokens(token.children.filter(shouldProcess), result);
};