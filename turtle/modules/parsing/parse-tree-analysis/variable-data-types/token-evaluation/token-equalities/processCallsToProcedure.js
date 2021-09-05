import { addTokenEquality } from
'./addTokenEquality.js';
import { getOutputValueTokenForProcedure } from
'./getOutputValueTokenForProcedure.js';

export function processCallsToProcedure(cachedParseTree, procedure, result) {
	const valueToken = getOutputValueTokenForProcedure(procedure);
	if (valueToken !== undefined) {
		const calls = cachedParseTree.getProcedureCallsByName(procedure.name);
		for (const call of calls) {
			addTokenEquality(valueToken, call, result);
		}
	}
};