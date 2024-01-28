import { ArrayUtils } from '../../../ArrayUtils.js';
import { getAllDescendentsAsArray } from '../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { SetUtils } from '../../../SetUtils.js';
import { StringUtils } from '../../../StringUtils.js';

const operatorTokenTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.UNARY_OPERATOR
]);
const removableSubstrings = [
'Invalid procedure name',
' operator requires input of type',
'Valid procedure name expected'];

function isOperatorMessage(msg) {
	if (!operatorTokenTypes.has(msg.token.type) &&
		(msg.token.parentNode === null ||
			!operatorTokenTypes.has(msg.token.parentNode.type)))
		return false;
	if (msg.msg.indexOf('must be immediately before the value it operates on') !== -1 &&
	msg.msg.indexOf('Unary') !== -1)
		return true;
	return msg.msg.indexOf(' operand for operator ') !== -1 &&
		msg.msg.indexOf(' must be of type ') !== -1;
}

function isRemovable(msg) {
	if (isOperatorMessage(msg))
		return false;
	return StringUtils.containsAny(msg.msg, removableSubstrings);
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