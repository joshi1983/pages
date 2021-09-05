import { getDescendentsOfTypes } from
'../../../../../parsing/generic-parsing-utilities/getDescendentsOfTypes.js';
import { mightBeVariableReference } from
'../../../../../parsing/parse-tree-analysis/variable-data-types/mightBeVariableReference.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';
import { tokenToProcedure } from
'../../../../../parsing/parse-tree-analysis/tokenToProcedure.js';

export function getUnusedParameters(cachedParseTree) {
	const procStarts = cachedParseTree.getTokensByType(ParseTreeTokenType.PROCEDURE_START_KEYWORD).
		filter(t => t.children.length >= 2);
	const result = [];
	for (const procStart of procStarts) {
		const proc = tokenToProcedure(procStart);
		if (proc.parameters.length === 0)
			continue;
		const instructionListToken = proc.getInstructionListToken();
		if (instructionListToken === undefined ||
		instructionListToken.type !== ParseTreeTokenType.LIST)
			continue;
		const potentialParameterRefs = getDescendentsOfTypes(instructionListToken, [
			ParseTreeTokenType.LONG_STRING_LITERAL,
			ParseTreeTokenType.STRING_LITERAL,
			ParseTreeTokenType.VARIABLE_READ
		]);
		const possiblyReferencedParameters = new Set();
		for (const token of potentialParameterRefs) {
			if (mightBeVariableReference(token)) {
				possiblyReferencedParameters.add(token.val.toLowerCase());
			}
		}
		for (const parameter of proc.parameters) {
			if (!possiblyReferencedParameters.has(parameter))
				result.push([proc.name, parameter, procStart]);
		}
	}
	return result;
};

function removeParameter(parameterInfo, cachedParseTree, fixLogger) {
	const procStartToken = parameterInfo[2];
	const parameterName = parameterInfo[1];
	let proc = tokenToProcedure(procStartToken);
	const procedures = cachedParseTree.getProceduresMap();
	const cachedProcedure = procedures.get(proc.name);
	if (cachedProcedure !== undefined)
		proc = cachedProcedure;
	const parameterIndex = proc.parameters.indexOf(parameterName);
	const parameterListToken = proc.getTokenForParameter(parameterIndex);
	parameterListToken.remove();
	const procCalls = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(callToken => callToken.val.toLowerCase() === proc.name);
	const removed = [parameterListToken];
	// go through all calls to the procedure.
	for (const procCall of procCalls) {
		// remove associated parameter token.
		const child = procCall.children[parameterIndex];
		if (child !== undefined) {
			child.remove();
			removed.push(child);
		}
	}
	proc.parameters = proc.parameters.filter(p => p !== parameterName); // reflect the change in the Procedure instance.
	cachedParseTree.tokensRemoved(removed);
	fixLogger.log(`Removed unused parameter ${parameterInfo[1]} of procedure ${parameterInfo[0]}`, procStartToken);
}

export function removeUnusedParameters(cachedParseTree, fixLogger) {
	const unusedParameters = getUnusedParameters(cachedParseTree);
	for (const parameterInfo of unusedParameters) {
		removeParameter(parameterInfo, cachedParseTree, fixLogger);
	}
};