import { argListToParameterValueTokens } from
'../../../../../../../parsing/js-parsing/translation-to-weblogo/type-processors/function-calls/argListToParameterValueTokens.js';
import { getDistinctVariableNameDeclared } from
'./getDistinctVariableNameDeclared.js';
import { processToken } from '../processToken.js';

export function fillText(token, result, settings) {
	const argList = token.children[1];
	const paramTokens = argListToParameterValueTokens(argList);
	const textToken = paramTokens[0];
	const xToken = paramTokens[1];
	const yToken = paramTokens[2];
	if (xToken !== undefined && yToken !== undefined) {
		result.append('jumpTo [');
		processToken(xToken, result, settings);
		result.append(' ');
		processToken(yToken, result, settings);
		result.append(']\n');
	}
	if (textToken !== undefined) {
		const prevPenSizeVarName = getDistinctVariableNameDeclared(token, result, 'oldPenSize', settings);
		result.append('penSize\n');
		result.append(`\nsetPenSize 0\n`);
		result.append(`label `);
		processToken(textToken, result, settings);
		result.append('\n');
		result.append(`\nsetPenSize :${prevPenSizeVarName}\n`);
	}
};