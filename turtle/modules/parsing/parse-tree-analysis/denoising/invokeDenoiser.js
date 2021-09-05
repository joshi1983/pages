import { ArrayUtils } from '../../../ArrayUtils.js';
import { getInstructionListChildToken } from '../getInstructionListChildToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { SetUtils } from '../../../SetUtils.js';

const likelyInvokeParameterTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.LIST,
	ParseTreeTokenType.LONG_STRING_LITERAL,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR,
	ParseTreeTokenType.VARIABLE_READ
]);

function isInvokeMessage(msg) {
	return msg.msg.indexOf('invoke should be within curved brackets') !== -1;
}

export function invokeDenoiser(cachedParseTree, parseMessages) {
	const invokeMessages = parseMessages.filter(isInvokeMessage);
	if (invokeMessages.length !== 0) {
		const toRemove = new Set();
		const tokensAffected = new Set();
		invokeMessages.forEach(function(invokeMessage) {
			let token = getInstructionListChildToken(invokeMessage.token);
			SetUtils.addAll(tokensAffected, token.getAllDescendentsAsArray());
			tokensAffected.add(token);
			for (token = token.nextSibling;token !== null && likelyInvokeParameterTypes.has(token.type); token = token.nextSibling) {
				SetUtils.addAll(tokensAffected, token.getAllDescendentsAsArray());
				tokensAffected.add(token);
			}
		});
		ArrayUtils.remove(parseMessages, m => !tokensAffected.has(m.token) || isInvokeMessage(m));
	}
};