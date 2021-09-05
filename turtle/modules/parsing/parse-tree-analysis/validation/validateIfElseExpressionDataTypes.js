import { DataTypes } from '../../data-types/DataTypes.js';
import { dataTypesToEnglish } from '../../../help/command-details/dataTypesToEnglish.js';
import { getRequiredTypesForTokenBasic } from '../variable-data-types/getRequiredTypesForTokenBasic.js';
import { isIfElseExpressionToken } from '../isIfElseExpressionToken.js';

export function validateIfElseExpressionDataTypes(cachedParseTree, parseLogger) {
	const ifelses = cachedParseTree.getCommandCallsByName('ifelse').
		filter(isIfElseExpressionToken);
	const tokenTypes = cachedParseTree.getTokensToDataTypes();
	ifelses.forEach(function(ifelseExpressionToken) {
		const requiredTypes = getRequiredTypesForTokenBasic(ifelseExpressionToken);
		if (requiredTypes === undefined)
			return;
		const requiredDataTypes = new DataTypes(requiredTypes);
		const child1 = ifelseExpressionToken.children[1];
		const child2 = ifelseExpressionToken.children[2];
		const child1Types = tokenTypes.get(child1);
		const child2Types = tokenTypes.get(child2);
		if (child1Types !== undefined && child2Types !== undefined) {
			if (!requiredDataTypes.hasIntersectionWith(child1Types) && 
			!requiredDataTypes.hasIntersectionWith(child2Types))
				return; // Another validator would already handle this case.
				// More validation messages here would be noisey.
		}
		if (child1Types !== undefined) {
			if (!requiredDataTypes.hasIntersectionWith(child1Types))
				parseLogger.error(`The corresponding ifelse has acceptable types ${dataTypesToEnglish(DataTypes.stringify(requiredDataTypes), false)} but the first ifelse-case's types were found to be ${dataTypesToEnglish(child1Types, false)}`, child1, false);
		}
		if (child2Types !== undefined) {
			if (!requiredDataTypes.hasIntersectionWith(child2Types))
				parseLogger.error(`The corresponding ifelse has acceptable types ${dataTypesToEnglish(DataTypes.stringify(requiredDataTypes), false)} but the second ifelse-case's types were found to be ${dataTypesToEnglish(child2Types, false)}`, child2, false);
		}
	});
};