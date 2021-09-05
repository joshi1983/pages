import { getRoughNameFrom } from
'./helpers/getRoughNameFrom.js';
import { MigrationInfo } from
'../../MigrationInfo.js';
import { processTokens } from
'./helpers/processTokens.js';

export function processFunctionCall(token, result, settings) {
	const info = MigrationInfo.getFunctionInfo(token, settings);
	if (info !== undefined) {
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
		result.append(' ');
		processTokens(argList.children, result, settings);
	}
};