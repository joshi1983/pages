import { ArrayUtils } from '../../../ArrayUtils.js';

const safeToRemoveSubstrings = [
'First operand for operator',
'Second operand for operator',
'must be of type',
'command requires input of type'
];

function isRemovable(cachedParseTree, msg, affectedProcedureNames) {
	const proc = cachedParseTree.getProcedureAtToken(msg.token);
	if (proc === undefined)
		return false; // We don't want to remove any message tied to something outside of a procedure.
	if (!affectedProcedureNames.has(proc.name))
		return false;
	return safeToRemoveSubstrings.some(substr => msg.msg.indexOf(substr) !== -1);
}

function isProcedureDataTypeMessage(msg) {
	if (typeof msg.token.val !== 'string')
		return false;
	return msg.msg.indexOf('procedure requires input the following input types') !== -1;
}

/*
This is activated when insufficient data types are passed to a procedure.
The noise includes lots of messages tied to the associated parameter in the called procedure.
*/
export function procedureParameterTypeDenoiser(cachedParseTree, parseMessages) {
	const procMessages = parseMessages.filter(isProcedureDataTypeMessage);
	if (procMessages.length === 0)
		return; // don't change anything.
	const affectedProcedureNames = new Set();
	procMessages.forEach(function(msg) {
		let procName = msg.msg.trim().toLowerCase();
		const index = procName.indexOf(' ');
		if (index !== -1)
			procName = procName.substring(0, index);
		affectedProcedureNames.add(procName);
	});
	ArrayUtils.remove(parseMessages, m => isProcedureDataTypeMessage(m) || !isRemovable(cachedParseTree, m, affectedProcedureNames));
};