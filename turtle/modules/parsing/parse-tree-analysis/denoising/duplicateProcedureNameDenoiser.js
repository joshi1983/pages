import { ArrayUtils } from '../../../ArrayUtils.js';
import { getTokensByType } from '../../generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { tokenToProcedure } from '../tokenToProcedure.js';

/*
There are commonly a lot of confusing messages for tokens 
within procedures with a duplicated procedure name.

This removes all error messages for tokens within a duplicated procedure 
so the end-user can focus on the more clear messages.
*/
const prefix = 'Procedure name ';
function getProcedureName(msg) {
	msg = msg.substring(prefix.length).trim();
	const index = msg.indexOf(' ');
	return msg.substring(0, index).trim().toLowerCase();
}

function isDuplicateProcedureMessage(m) {
	return m.msg.startsWith(prefix) && m.msg.indexOf(' matches an existing procedure') !== -1;
}

export function duplicateProcedureNameDenoiser(cachedParseTree, parseMessages) {
	const duplicateMessages = parseMessages.filter(isDuplicateProcedureMessage);
	if (duplicateMessages.length !== 0) {
		const procs = getTokensByType(cachedParseTree, ParseTreeTokenType.PROCEDURE_START_KEYWORD).map(tokenToProcedure);
		const parseMessagesFiltered = parseMessages.filter(m => !isDuplicateProcedureMessage(m));
		const messagesToRemove = new Set();
		duplicateMessages.forEach(function(parseMessage) {
			const procName = getProcedureName(parseMessage.msg);
			const matchingProcs = procs.filter(proc => proc.name === procName);
			matchingProcs.forEach(function(proc) {
				parseMessagesFiltered.forEach(function(parseMessage2) {
					if (proc.isContainingToken(parseMessage2.token))
						messagesToRemove.add(parseMessage2);
				});
			});
		});
		ArrayUtils.remove(parseMessages, m => !messagesToRemove.has(m));
	}
};