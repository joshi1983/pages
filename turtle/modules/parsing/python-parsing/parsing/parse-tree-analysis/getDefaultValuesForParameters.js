import { filterBracketsAndCommas } from
'../../new-translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { getParametersParentToken } from
'../../parse-tree-analysis/function-definition/getParametersParentToken.js';
import { getStringLiteralValue } from
'../../parse-tree-analysis/variable-data-types/evaluators/getStringLiteralValue.js';
import { isNumber } from '../../../../isNumber.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function tokenToDefaultValue(child) {
	if (child.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	child.children.length >= 2 &&
	child.children[0].type === ParseTreeTokenType.IDENTIFIER) {
		const valueToken = child.children[1];
		if (valueToken.type === ParseTreeTokenType.NONE)
			return null;
		if (valueToken.type === ParseTreeTokenType.STRING_LITERAL ||
		valueToken.type === ParseTreeTokenType.LONG_STRING_LITERAL)
			return getStringLiteralValue(valueToken);
		const val = child.children[1].val;
		const numVal = parseFloat(val);
		if (isNumber(numVal))
			return numVal;
	}
}

export function getDefaultValuesForParameters(functionDefinition) {
	if (functionDefinition.parameterDefaultValues === undefined) {
		const parent = getParametersParentToken(functionDefinition.functionRootToken);
		const children = filterBracketsAndCommas(parent.children);
		functionDefinition.parameterDefaultValues = children.map(tokenToDefaultValue);
	}
	return functionDefinition.parameterDefaultValues;
};