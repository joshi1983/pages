import { alwaysEndsWithPolyEnd } from './alwaysEndsWithPolyEnd.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function validatePolyEndCalledTwiceInvolvingProcedure(polyEndCalls, cachedParseTree, parseLogger) {
	polyEndCalls.forEach(function(polyEndCall) {
		const prev = polyEndCall.previousSibling;
		if (prev !== null && prev.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			const proc = cachedParseTree.getProcedureByName(prev.val.toLowerCase());
			if (proc !== undefined && alwaysEndsWithPolyEnd(proc)) {
				parseLogger.error(`The procedure ${proc.name} ends with a call to polyEnd so this call to polyEnd will always cause an error.  Consider removing this call to polyEnd.`, polyEndCall);
			}
		}
	});
};