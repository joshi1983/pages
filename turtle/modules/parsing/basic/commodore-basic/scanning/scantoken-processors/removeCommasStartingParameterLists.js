import { CommodoreInternalFunctions } from
'../../CommodoreInternalFunctions.js';
import { isComment } from
'../../../qbasic/scanning/isComment.js';

function needsAtLeast1Parameter(info) {
	if (info === undefined)
		return false;
	if (info.argCount !== undefined) {
		return info.argCount.min !== 0;
	}
	if (info.args !== undefined &&
	info.args.length === 0)
		return false;
	return true;
}

export function removeCommasStartingParameterLists(scanTokens) {
	let funcNameNeedingParameters = false;
	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		const info = CommodoreInternalFunctions.getFunctionInfo(tok.s);
		if (needsAtLeast1Parameter(info))
			funcNameNeedingParameters = true;
		else if (tok.s === ',' &&
		funcNameNeedingParameters) {
			scanTokens.splice(i, 1); // remove comma token
			i--;
		}
		else if (!isComment(tok.s))
			funcNameNeedingParameters = false;
	}
}