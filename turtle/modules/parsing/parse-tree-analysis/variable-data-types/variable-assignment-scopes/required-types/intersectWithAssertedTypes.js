import { DataTypes } from
'../../../../data-types/DataTypes.js';
import { getRequiredTypesFromAssertion } from
'../getRequiredTypesFromAssertion.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

export function intersectWithAssertedTypes(token,
variableName, tokenToTypes, result, cachedParseTree) {
	const children = token.children;
	const requiredTokenTypesMap = getRequiredTypesFromAssertion(token, variableName, tokenToTypes, cachedParseTree);
	const types = requiredTokenTypesMap.get(variableName);
	if (types !== undefined)
		result.intersectWith(new DataTypes(types));
};