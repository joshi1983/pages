import { ArrayBuffer } from
'./function-calls/ArrayBuffer.js';
import { Color } from
'./function-calls/Color.js';
import { filterBracketsAndCommas } from
'./helpers/filterBracketsAndCommas.js';
import { getRoughNameFrom } from
'./helpers/getRoughNameFrom.js';
import { MigrationInfo } from
'../../MigrationInfo.js';
import { ofDim } from
'./function-calls/ofDim.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processTokens } from
'./helpers/processTokens.js';
import { repeat } from
'./function-calls/repeat.js';
import { repeatFor } from
'./function-calls/repeatFor.js';
import { valueToLiteralCode } from
'../../../../valueToLiteralCode.js';
import { Vector2D } from
'./function-calls/Vector2D.js';
import { Vector3D } from
'./function-calls/Vector3D.js';

const specialFunctionNameProcessors = new Map([
	['Array', ArrayBuffer]
]);
for (const func of [ArrayBuffer, Color, ofDim, repeat, repeatFor, Vector2D, Vector3D]) {
	specialFunctionNameProcessors.set(func.name, func);
}

function closeBracket(wrapInCurvedBrackets, result) {
	if (wrapInCurvedBrackets)
		result.append(' ) ');
}

export function processFuncCall(token, result, settings) {
	const info = MigrationInfo.getFunctionInfo(token, settings);
	const parent = token.parentNode;
	let wrapInCurvedBrackets = true;
	if (parent.type === ParseTreeTokenType.CODE_BLOCK ||
	parent.type === ParseTreeTokenType.TREE_ROOT)
		wrapInCurvedBrackets = false;
	if (info !== undefined) {
		if (info.returnTypes === null || info.removeInMigration)
			result.processCommentsUpToToken(token);
		const specialProcessor = specialFunctionNameProcessors.get(info.name);
		if (specialProcessor !== undefined) {
			specialProcessor(token, result, settings);
			return;
		}
		if (info.migrateToCode !== undefined || info.removeInMigration)
			wrapInCurvedBrackets = false;
			
		if (wrapInCurvedBrackets)
			result.append(' ( ');
		if (info.migrateToCode !== undefined) {
			result.append(info.migrateToCode);
			return;
		}
		else if (info.to) {
			result.append(info.to);
		}
		else if (info.toProc)
			result.append(info.toProc);
		else if (info.removeInMigration)
			return;
	}
	else {
		const roughName = getRoughNameFrom(token.children[0]);
		if (typeof roughName === 'string') {
			if (wrapInCurvedBrackets)
				result.append(' ( ');
			result.append(roughName);
		}
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
		const argTokens = filterBracketsAndCommas(argList.children);
		processTokens(argTokens, result, settings);
		// add any default values.
		if (info !== undefined && info.args !== undefined) {
			const args = info.args;
			for (let i = argTokens.length; i < args.length; i++) {
				const paramInfo = args[i];
				if (paramInfo.defaultValue !== undefined) {
					result.append(` ${valueToLiteralCode(paramInfo.defaultValue)} `);
				}
			}
		}
		
		if (wrapAllParametersWithSquareBrackets)
			result.append(' ] ');
	}
	closeBracket(wrapInCurvedBrackets, result);
};