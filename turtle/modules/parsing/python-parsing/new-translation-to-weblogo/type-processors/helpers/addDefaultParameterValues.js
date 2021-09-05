import { getAllFunctionDefinitions } from
'../../../parse-tree-analysis/getAllFunctionDefinitions.js';
import { getDefaultValuesForParameters } from
'../../../parsing/parse-tree-analysis/getDefaultValuesForParameters.js';
import { valueToWebLogoExpression } from '../helpers/valueToWebLogoExpression.js';

export function addDefaultParameterValues(functionName, numParametersToSkip,
result, cachedParseTree) {
	const functionDefinitions = getAllFunctionDefinitions(cachedParseTree).filter(fd =>
		fd.name === functionName);
	if (functionDefinitions.length === 1) {
		const definition = functionDefinitions[0];
		if (definition !== undefined) {
			const parameterDefaultValues = getDefaultValuesForParameters(definition);
			// get numDefinitionParameters from definitionToken.
			const numParametersNeeded = parameterDefaultValues.length - numParametersToSkip;
			for (let i = 0; i < numParametersNeeded; i++) {
				const val = parameterDefaultValues[i + numParametersToSkip];
				if (val !== undefined) {
					result.append(' ' + valueToWebLogoExpression(val));
				}
			}
		}
	}
};