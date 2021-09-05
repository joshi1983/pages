import { ArrayUtils } from '../../../ArrayUtils.js';
import { Command } from '../../Command.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { SetUtils } from '../../../SetUtils.js';
import { StringUtils } from '../../../StringUtils.js';
await Command.asyncInit();

const removableSubstrings = [
'command requires input of type',
'The specified types were determined to be nothing',
' operand for operator ',
'unary operator requires input of type'
];
const prefix = 'The value assigned to ';
const makePrimaryNames = new Set();
const makeCommands = ['localmake', 'make'];
makeCommands.forEach(function(primaryName) {
	SetUtils.addAll(makePrimaryNames, Command.getLowerCaseCommandNameSet(Command.getCommandInfo(primaryName)));
});

function getVariableNameFromMakeToken(makeToken) {
	if (makeToken.children.length < 1 ||
	makeToken.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return;
	if (!makePrimaryNames.has(makeToken.val.toLowerCase()))
		return;
	if (!makeToken.children[0].isStringLiteral())
		return;
	return makeToken.children[0].val.toLowerCase();
}

function getVariableNameFromMessage(msg) {
	if (msg.msg.indexOf('make command requires input of type') !== -1)
		return getVariableNameFromMakeToken(msg.token.parentNode);
	if (msg.msg.indexOf(prefix) !== 0)
		return;
	const s = msg.msg.substring(prefix.length).trim();
	const index = s.indexOf(' ');
	if (index === -1)
		return;
	return s.substring(0, index).toLowerCase();
}

function isTheValueAssignedMessage(msg) {
	return msg.msg.indexOf(prefix) !== -1;
}

function isValueAssignedMessage(msg) {
	if (msg.msg.indexOf(' doesn\'t match any acceptable data type') === -1) {
		if (msg.msg.indexOf('make command requires input of type') === -1)
			return false;
	}
	const varName = getVariableNameFromMessage(msg);
	return varName !== undefined;
}

function isRemovable(msg) {
	return StringUtils.containsAny(msg.msg, removableSubstrings);
}

function isTokenReadingVariable(varName) {
	return function(token) {
		return token.type === ParseTreeTokenType.VARIABLE_READ &&
			token.val.toLowerCase() === varName;
	};
}

function isContinuableCase(msg, varName) {
	if (!isRemovable(msg))
		return true;
	if (msg.token.type === ParseTreeTokenType.VARIABLE_READ &&
		!isTokenReadingVariable(varName)(msg.token))
		return true;
	if (msg.msg.indexOf('make command requires input of type') === -1 &&
	msg.token.children.length > 0 && !msg.token.children.some(isTokenReadingVariable(varName)))
		return true;
	return false;
}

function findRemovableMessagesInProc(cachedParseTree, proc, parseMessages, varName) {
	const result = [];
	for (let i = 0; i < parseMessages.length; i++) {
		const msg = parseMessages[i];
		if (isContinuableCase(msg, varName))
			continue;
		const proc2 = cachedParseTree.getProcedureAtToken(msg.token);
		if (proc2 === undefined || proc2.name !== proc.name)
			continue;
		result.push(msg);
	}
	return result;
}

function findRemovableMessagesGlobal(cachedParseTree, parseMessages, varName) {
	const result = [];
	for (let i = 0; i < parseMessages.length; i++) {
		const msg = parseMessages[i];
		if (isContinuableCase(msg, varName))
			continue;
		result.push(msg);
	}
	return result;
}

function preferTheValueAssignedMessages(parseMessages) {
	// if any are the value assigned messages, remove every other kind of message.
	if (parseMessages.some(isTheValueAssignedMessage)) {
		ArrayUtils.remove(parseMessages, isTheValueAssignedMessage);
	}
}

export function valueAssignedDenoiser(cachedParseTree, parseMessages) {
	let valueAssignedMessages = parseMessages.filter(isValueAssignedMessage);
	if (valueAssignedMessages.length === 0)
		return;
	if (valueAssignedMessages.length > 1) {
		preferTheValueAssignedMessages(valueAssignedMessages);
	}
	const toRemove = new Set();
	valueAssignedMessages.forEach(function(msg) {
		const varName = getVariableNameFromMessage(msg);
		const proc = cachedParseTree.getProcedureAtToken(msg.token);
		if (proc !== undefined) {
			SetUtils.addAll(toRemove, findRemovableMessagesInProc(cachedParseTree, proc, parseMessages, varName));
		}
		else {
			SetUtils.addAll(toRemove, findRemovableMessagesGlobal(cachedParseTree, parseMessages, varName));
		}
	});
	valueAssignedMessages = new Set(valueAssignedMessages);
	ArrayUtils.remove(parseMessages, m => !toRemove.has(m) || valueAssignedMessages.has(m));
};