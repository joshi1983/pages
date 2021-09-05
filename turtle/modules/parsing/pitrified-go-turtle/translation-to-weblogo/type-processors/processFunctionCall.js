import { getRoughNameFrom } from
'./helpers/getRoughNameFrom.js';
import { MigrationInfo } from
'../../MigrationInfo.js';
import { processTokens } from
'./helpers/processTokens.js';
import { PrintLn } from
'./function-calls/PrintLn.js';

const specialProcessors = new Map([
	['print', PrintLn]
]);

export function processFunctionCall(token, result, settings) {
	const info = MigrationInfo.getFunctionInfo(token, settings);
	if (info !== undefined) {
		const special = specialProcessors.get(info.to);
		if (special !== undefined) {
			special(token, result, settings);
			return;
		}
		if (info.migrateToCode !== undefined) {
			result.append(info.migrateToCode);
			return;
		}
		else if (info.to)
			result.append(info.to);
		else if (info.toProc)
			result.append(info.toProc);
	}
	else {
		const roughName = getRoughNameFrom(token.children[0]);
		if (typeof roughName === 'string')
			result.append(roughName);
		else {
			result.append(`; FIXME: fix the translation here.\n`);
			result.append(`; Unable to find a suitable name to translate the function to.\n`);
			return; 
		}
	}
	const argList = token.children[1];
	if (argList !== undefined) {
		const wrapAllParametersWithSquareBrackets = info !== undefined &&
			info.wrapAllParametersWithSquareBrackets === true;
		if (wrapAllParametersWithSquareBrackets)
			result.append(' [ ');
		result.append(' ');
		processTokens(argList.children, result, settings);
		if (wrapAllParametersWithSquareBrackets)
			result.append(' ] ');
	}
};