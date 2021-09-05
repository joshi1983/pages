import { ArrayUtils } from '../../../ArrayUtils.js';
import { getAllDescendentsAsArray } from '../../parse-tree-token/getAllDescendentsAsArray.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { SetUtils } from '../../../SetUtils.js';

const operatorTokenTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.UNARY_OPERATOR
]);

function isOperatorMessage(msg) {
	if (!operatorTokenTypes.has(msg.token.type) &&
		(msg.token.parentNode === null ||
			!operatorTokenTypes.has(msg.token.parentNode.type)))
		return false;
	return msg.msg.indexOf(' operand for operator ') !== -1 &&
		msg.msg.indexOf(' must be of type ') !== -1;
}

function isRemovable(msg) {
	if (isOperatorMessage(msg))
		return false;
	return msg.msg.indexOf(' operator requires input of type') !== -1;
}

/*
Cleans messages like:
Line 116: Second operand for operator * must be of type num.
Line 116: * binary operator requires input of type(s) number
*/
export function operatorMessageDenoiser(cachedParseTree, parseMessages) {
	const operatorMessages = parseMessages.filter(isOperatorMessage);
	const toRemove = new Set();
	const tokensAffected = new Set();
	operatorMessages.forEach(function(operatorMessage) {
		const token = operatorMessage.token;
		SetUtils.addAll(tokensAffected, getAllDescendentsAsArray(token));
		tokensAffected.add(token);
	});
	ArrayUtils.remove(parseMessages, m => !tokensAffected.has(m.token) || !isRemovable(m));
};