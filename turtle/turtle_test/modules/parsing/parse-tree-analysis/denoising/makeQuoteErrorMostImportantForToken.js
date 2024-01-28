import { ArrayUtils } from '../../../ArrayUtils.js';
import { CommandCalls } from '../CommandCalls.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
const quoteMessagePrefix = 'Both make and localmake commands require the first input to start with a';

function isQuoteTokenMessage(msg) {
	if (msg.token.isStringLiteral() || msg.token.parentNode === null ||
	msg.token.parentNode.type !== ParseTreeTokenType.PARAMETERIZED_GROUP ||
	msg.token.parentNode.children.indexOf(msg.token) !== 0 ||
	msg.msg.indexOf(quoteMessagePrefix) === -1)
		return false;
	return CommandCalls.tokenMatchesPrimaryNames(msg.token.parentNode, ['localmake', 'make']);
}

export function makeQuoteErrorMostImportantForToken(cachedParseTree, parseMessages) {
	const quoteTokens = new Set(parseMessages.filter(isQuoteTokenMessage).map(msg => msg.token));
	if (quoteTokens.size === 0)
		return;
	const messagesToRemove = new Set();
	parseMessages.
		filter(msg => quoteTokens.has(msg.token) && msg.msg.indexOf(quoteMessagePrefix) === -1).
		forEach(function(msg) {
		messagesToRemove.add(msg);
	});
	ArrayUtils.remove(parseMessages, m => !messagesToRemove.has(m));
};