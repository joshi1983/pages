import { isSpecialMethodCall } from './function-calls/isSpecialMethodCall.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';
import { processTokens } from './helpers/processTokens.js';
import { usesSubscript } from './helpers/usesSubscript.js';

export function processIdentifierToken(token, result, cachedParseTree) {
	if (token.children.length === 0) {
		if (token.parentNode.type === ParseTreeTokenType.DOT)
			result.append(`${token.val}`);
		else
			result.append(`:${token.val}`);
	}
	else if (usesSubscript(token))
		processToken(token.children[0], result, cachedParseTree);
	else if (isSpecialMethodCall(token))
		processTokens(token.children[0].children, result, cachedParseTree);
	else {
		result.append(`${token.val}`);
		processTokens(token.children, result, cachedParseTree);
	}
};