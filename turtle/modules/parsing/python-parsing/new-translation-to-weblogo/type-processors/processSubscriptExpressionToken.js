import { isBeingRead } from './helpers/isBeingRead.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processIndex } from './helpers/processIndex.js';
import { processListLiteralToken } from './processListLiteralToken.js';
import { processToken } from './processToken.js';

function processListExpression(subscriptExpressionToken, result, prefix, cachedParseTree) {
	const listToken = subscriptExpressionToken.children[0];
	if (listToken.type === ParseTreeTokenType.IDENTIFIER)
		result.append(`${prefix}${listToken.val}`);
	else if (listToken.type === ParseTreeTokenType.LIST_LITERAL)
		processListLiteralToken(listToken, result, cachedParseTree);
	else {
		// FIXME: handle other cases?  Are there any?
	}
}

function getSublistInfo(subscript) {
	const children = subscript.children.filter(t => t.type !== ParseTreeTokenType.SQUARE_LEFT_BRACKET &&
		t.type !== ParseTreeTokenType.SQUARE_RIGHT_BRACKET);
	if (children.length > 3 || children.length < 2)
		return; // indicate not to translate using WebLogo's sublist command.
	if (!children.some(c => c.type === ParseTreeTokenType.COLON))
		return; // if colon(:) isn't used in the subscript, don't translate to WebLogo's sublist command.

	let fromIndexToken = children[0];
	if (fromIndexToken.type === ParseTreeTokenType.COLON)
		fromIndexToken = null;
	let toIndexToken = children[children.length - 1];
	if (toIndexToken.type === ParseTreeTokenType.COLON)
		toIndexToken = null;
	if (toIndexToken !== null &&
	toIndexToken.type === ParseTreeTokenType.NUMBER_LITERAL && toIndexToken.val === '-1')
		toIndexToken = null; // -1 in Python means "end of list".  In other words, don't cut any part of the tail.
		// A null toIndexToken means the same here.

	return {
		'fromIndexToken': fromIndexToken,
		'toIndexToken': toIndexToken
	};
}

function processToIndex(token, buffer, cachedParseTree) {
	if (token.type === ParseTreeTokenType.NUMBER_LITERAL) {
		const val = parseFloat(token.val);
		if (!isNaN(val)) {
			buffer.append('' + (val + 1));
			return;
		}
	}
	buffer.append('1 + ');
	processToken(token, buffer, cachedParseTree);
}

export function processSubscriptExpressionToken(token, result, cachedParseTree) {
	const children = token.children;
	const subscriptToken = children[1];
	if (isBeingRead(token)) {
		const sublistInfo = getSublistInfo(token.children[1]);
		if (sublistInfo !== undefined) {
			result.append(' sublist ');
			processToken(token.children[0], result, cachedParseTree);
			result.append(' ');
			if (sublistInfo.fromIndexToken === null)
				result.append('1');
			else
				processIndex(sublistInfo.fromIndexToken, result, cachedParseTree);
			result.append(' ');
			if (sublistInfo.toIndexToken === null)
				result.append('0');
			else {
				processToIndex(sublistInfo.toIndexToken, result, cachedParseTree);
			}
		}
		else {
			result.append(` item `);
			processIndex(subscriptToken, result, cachedParseTree);
			processListExpression(token, result, ':', cachedParseTree);
		}
	}
	else {
		result.append(' setItem ');
		processIndex(subscriptToken, result, cachedParseTree);
		processListExpression(token, result, '"', cachedParseTree);
	}
};
