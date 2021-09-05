import { ArrayUtils } from '../../../ArrayUtils.js';

function isProcedureInProcedureMessage(msg) {
	return msg.msg.indexOf('You can not define a procedure in another procedure') !== -1;
}

function isRemovable(msg) {
	return !isProcedureInProcedureMessage(msg);
}

export function procedureInProcedureDenoiser(cachedParseTree, parseMessages) {
	const procedureInProcedureMessages = parseMessages.filter(isProcedureInProcedureMessage);
	if (procedureInProcedureMessages.length === 0)
		return;

	ArrayUtils.remove(parseMessages, m => !isRemovable(m));
};