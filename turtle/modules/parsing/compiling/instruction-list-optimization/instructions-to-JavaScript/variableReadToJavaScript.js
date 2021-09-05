import { MaybeDecided } from '../../../../MaybeDecided.js';

export function variableReadToJavaScript(variableReadInstruction, isLocal) {
	if (isLocal === MaybeDecided.Yes)
		return `context.getCurrentExecutingProcedure().localVariables.get("${variableReadInstruction.variableName}")`;
	else if (isLocal === MaybeDecided.No)
		return `context.globalVariables.get("${variableReadInstruction.variableName}")`;
	else
		return `context.readVariable("${variableReadInstruction.variableName}")`;
};