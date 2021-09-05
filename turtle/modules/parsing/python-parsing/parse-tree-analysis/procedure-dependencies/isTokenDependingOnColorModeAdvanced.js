import { DataTypes } from '../../data-types/DataTypes.js';
import { filterBracketsAndCommas } from '../../translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { MaybeDecided } from '../../../../MaybeDecided.js';
import { PythonFunctions } from '../../PythonFunctions.js';

function tokenToTypesString(token, tokenTypes) {
	const types = tokenTypes.get(token);
	if (types !== undefined)
		return DataTypes.stringify(types);
}

export function isTokenDependingOnColorModeAdvanced(cachedParseTree, token) {
	const functionInfo = PythonFunctions.getFunctionInfo(token.val, 'turtle');
	if (functionInfo === undefined)
		return MaybeDecided.No;
	if (functionInfo.anyParameterDependsOnColorMode !== true)
		return MaybeDecided.No;
	const tokenTypes = cachedParseTree.getTokensToDataTypes();
	const childTokens = filterBracketsAndCommas(token.children);
	if (childTokens.length === 1) {
		const sTypes = tokenToTypesString(childTokens[0], tokenTypes);
		if (sTypes === 'string' || sTypes === 'num' || sTypes === 'bool')
			return MaybeDecided.No;
		else if (sTypes === 'list' || sTypes === 'tuple' || sTypes === 'list|tuple')
			return MaybeDecided.Yes;
		return MaybeDecided.Maybe;
	}
	if (childTokens.length === 2 && functionInfo.groupTwoArgsAsList === true)
		return MaybeDecided.Yes;
	if (childTokens.length === 3 && functionInfo.treatThreeArgsAsSingleColor === true)
		return MaybeDecided.Yes;
	let result = MaybeDecided.No;
	for (let i = 0; i < childTokens.length; i++) {
		const sTypes = tokenToTypesString(childTokens[i], tokenTypes);
		if (sTypes === 'list' || sTypes === 'tuple' || sTypes === 'list|tuple')
			result = MaybeDecided.Yes;
		else if (sTypes !== 'string' && sTypes !== 'num' && sTypes !== 'bool')
			result = MaybeDecided.Maybe;
	}
	return result;
};