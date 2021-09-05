import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { getAllFunctionDefinitions } from '../../../parse-tree-analysis/getAllFunctionDefinitions.js';
import { getDefaultValuesForParameters } from
'../../../parsing/parse-tree-analysis/getDefaultValuesForParameters.js';
import { getParametersFromFunctionDefinition } from
'../../../parse-tree-analysis/function-definition/getParametersFromFunctionDefinition.js';
import { processToken } from '../processToken.js';
import { valueToWebLogoExpression } from '../helpers/valueToWebLogoExpression.js';

export function processCustomFunctionCall(token, result, cachedParseTree, settings) {
	const functionDefinitions = getAllFunctionDefinitions(cachedParseTree).
		filter(func => func.name === token.val);
	if (functionDefinitions.length === 1) {
		const func = functionDefinitions[0];
		const parameters = getParametersFromFunctionDefinition(func);
		const argList = token.children[0];
		let children = token.children;
		if (argList !== undefined)
			children = argList.children;

		const tokenChildren = filterBracketsAndCommas(children);
		if (parameters.size === tokenChildren.length)
			return;
		if (!result.endsWithAndNotAcomment(' '))
			result.append(' ');
		result.append(`${token.val} `);
		const defaultValues = getDefaultValuesForParameters(func);
		for (let i = 0; i < parameters.size; i++) {
			if (i < tokenChildren.length)
				processToken(tokenChildren[i], result, cachedParseTree, settings);
			else {
				const val = defaultValues[i];
				if (val !== undefined)
					result.append(valueToWebLogoExpression(val));
			}
			if (!result.endsWithAndNotAcomment(' '))
				result.append(' ');
		}
		return true;
	}
};