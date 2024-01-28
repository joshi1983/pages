export function variableReadToJavaScript(variableReadInstruction, isLocal) {
	if (isLocal === true)
		return `context.getCurrentExecutingProcedure().localVariables.get("${variableReadInstruction.variableName}")`;
	else if (isLocal === false)
		return `context.globalVariables.get("${variableReadInstruction.variableName}")`;
	else
		return `context.readVariable("${variableReadInstruction.variableName}")`;
};