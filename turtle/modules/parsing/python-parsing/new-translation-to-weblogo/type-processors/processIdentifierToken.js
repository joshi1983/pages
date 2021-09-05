import { attemptProcessingAsConstant } from './helpers/attemptProcessingAsConstant.js';
import { isSpecialMethodCall } from './function-calls/isSpecialMethodCall.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';
import { processTokens } from './helpers/processTokens.js';

// This is checking for something like:
// t.screen.bgcolor("black")
// where token would correspond with the "t".
function isDeepMethodCall(token, result, cachedParseTree) {
	const parent = token.parentNode;
	token = parent.children[1];
	if (token === undefined || token.type !== ParseTreeTokenType.DOT)
		return false;
	token = token.children[0];
	const name = token.val;
	if (typeof name !== 'string')
		return false;
	return true;
}

export function processIdentifierToken(token, result, cachedParseTree) {
	if (token.children.length === 0) {
		if (token.parentNode.type === ParseTreeTokenType.DOT)
			result.append(`${token.val}`);
		else
			result.append(`:${token.val}`);
	}
	else if (token.children[0].type === ParseTreeTokenType.SUBSCRIPT_EXPRESSION)
		processToken(token.children[0], result, cachedParseTree);
	else if (isSpecialMethodCall(token))
		processTokens(token.children[0].children, result, cachedParseTree);
	else {
		const translated = attemptProcessingAsConstant(token, result, cachedParseTree);
		if (!translated) {
			if (!isDeepMethodCall(token, result, cachedParseTree)) {
				result.append(`${token.val}`);
				processTokens(token.children, result, cachedParseTree);
			}
		}
	}
};