import { filterBracketsAndCommas } from
'./helpers/filterBracketsAndCommas.js';
import { getJossName } from
'./function-calls/getJossName.js';
import { MigrationInfo } from
'../../MigrationInfo.js';
import { processSpecialFunctionCall } from
'./function-calls/processSpecialFunctionCall.js';
import { processTokens } from
'./helpers/processTokens.js';

function getToName(jossName, info) {
	if (info !== undefined) {
		if (info.to !== undefined)
			return info.to;
		if (info.toProc !== undefined)
			return info.toProc;
	}
	return jossName;
}

export function processFunctionCall(token, result) {
	if (processSpecialFunctionCall(token, result))
		return;

	const jossName = getJossName(token);
	if (jossName === undefined) {
		result.append(`\n; Review this.
;Failed to find name of function from a function call\n`);
		return; // can't do anything here.
	}
	const info = MigrationInfo.getFunctionInfo(jossName);
	const toName = getToName(jossName, info);
	result.append(`${toName} `);
	const argList = token.children[1];
	if (argList !== undefined)
		processTokens(filterBracketsAndCommas(argList.children), result);
	if (info !== undefined && info.returnTypes === null)
		result.append('\n');
};