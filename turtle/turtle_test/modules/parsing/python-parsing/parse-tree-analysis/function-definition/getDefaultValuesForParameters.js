import { filterBracketsAndCommas } from
'../../translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { getParametersParentToken } from './getParametersParentToken.js';
import { isNumber } from '../../../../isNumber.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function tokenToDefaultValue(child) {
	if (child.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	child.children.length >= 2 &&
	child.children[0].type === ParseTreeTokenType.IDENTIFIER) {
		const valueToken = child.children[1];
		if (valueToken.type === ParseTreeTokenType.NONE)
			return null;
		if (valueToken.type === ParseTreeTokenType.STRING_LITERAL)
			return valueToken.val;
		const val = child.children[1].val;
		const numVal = parseFloat(val);
		if (isNumber(numVal))
			return numVal;
	}
}

export function getDefaultValuesForParameters(functionDefinition) {
	if (functionDefinition.parameterDefaultValues === undefined) {
		const values = [];
		const parent = getParametersParentToken(functionDefinition.functionRootToken);
		const children = filterBracketsAndCommas(parent.children);
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
		}
		functionDefinition.parameterDefaultValues = children.map(tokenToDefaultValue);
	}
	return functionDefinition.parameterDefaultValues;
};