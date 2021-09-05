import { MaybeDecided } from '../../../../../../MaybeDecided.js';

export function getEndingMakeStatement(jsVarName, webLogoVarName, isAlwaysLocal, isAlwaysGlobal, isLocalVariablesDefined) {
	let result;
	if (isAlwaysLocal === MaybeDecided.Yes) {
		if (isLocalVariablesDefined)
			result = `localVariables.set("${webLogoVarName}", ${jsVarName});`;
		else
			result = `context.localmake("${webLogoVarName}", ${jsVarName});`;
	}
	else
		result = `context.make("${webLogoVarName}", ${jsVarName});`;
	return '\n' + result;
};