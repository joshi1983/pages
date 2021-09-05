import { isBeingRead } from './helpers/isBeingRead.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processIndex } from './helpers/processIndex.js';

function processListExpression(subscriptToken, result, prefix) {
	const parent = subscriptToken.parentNode;
	if (parent.type === ParseTreeTokenType.IDENTIFIER)
		result.append(`${prefix}${parent.val}`);
	else {
		// FIXME: handle other cases?  Are there any?
	}
}

export function processSubscriptToken(token, result, cachedParseTree) {
	if (isBeingRead(token)) {
		result.append(` item `);
		processIndex(token, result, cachedParseTree);
		processListExpression(token, result, ':');
	}
	else {
		result.append(' setItem ');
		processIndex(token, result, cachedParseTree);
		processListExpression(token, result, '"');
	}
};
