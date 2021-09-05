import { isBeingRead } from './helpers/isBeingRead.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processIndex } from './helpers/processIndex.js';

function processListExpression(subscriptExpressionToken, result, prefix) {
	const listToken = subscriptExpressionToken.children[0];
	if (listToken.type === ParseTreeTokenType.IDENTIFIER)
		result.append(`${prefix}${listToken.val}`);
	else {
		// FIXME: handle other cases?  Are there any?
	}
}

export function processSubscriptExpressionToken(token, result, cachedParseTree) {
	const children = token.children;
	const subscriptToken = children[1];
	if (isBeingRead(token)) {
		result.append(` item `);
		processIndex(subscriptToken, result, cachedParseTree);
		processListExpression(token, result, ':');
	}
	else {
		result.append(' setItem ');
		processIndex(subscriptToken, result, cachedParseTree);
		processListExpression(token, result, '"');
	}
};
