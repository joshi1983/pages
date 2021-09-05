import { getRoughNameFrom } from
'./helpers/getRoughNameFrom.js';
import { canMakeBeProcessed, make } from
'./function-calls/make.js';
import { MigrationInfo } from
'../../MigrationInfo.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processTokens } from
'./helpers/processTokens.js';
import { PrintLn } from
'./function-calls/PrintLn.js';

const specialProcessors = new Map([
	['print', PrintLn]
]);

const goLangToProcessors = new Map([
	['make', [make, canMakeBeProcessed]]
]);

function processSpecial(token, result, settings, info) {
	let specialFunc = specialProcessors.get(info.to);
	if (specialFunc !== undefined) {
		specialFunc(token, result, settings);
		return true; // indicate processed.
	}
	const nameToken = token.children[0];
	if (nameToken.type === ParseTreeTokenType.IDENTIFIER &&
	nameToken.children.length === 0) {
		const name = nameToken.val;
		const specialInfo = goLangToProcessors.get(name);
		if (specialInfo !== undefined) {
			const isApplicable = specialInfo[1];
			if (isApplicable(token)) {
				specialInfo[0](token, result, settings);
				return true; // indicate processed.
			}
		}
	}
	return false;
}

export function processFunctionCall(token, result, settings) {
	const info = MigrationInfo.getFunctionInfo(token, settings);
	if (info !== undefined) {
		if (processSpecial(token, result, settings, info))
			return; // return if already processed.

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