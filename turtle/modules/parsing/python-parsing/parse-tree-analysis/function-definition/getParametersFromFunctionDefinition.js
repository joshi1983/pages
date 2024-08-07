import { filterBracketsAndCommas } from
'../../translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { getParametersParentToken } from './getParametersParentToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function getParametersFromFunctionDefinition(functionDefinition) {
	if (functionDefinition.parameterNameSet === undefined) {
		const names = new Set();
		const parent = getParametersParentToken(functionDefinition.functionRootToken);
		const children = filterBracketsAndCommas(parent.children);
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (child.type === ParseTreeTokenType.IDENTIFIER)
				names.add(child.val);
			if (child.type === ParseTreeTokenType.ARGUMENT_STAR &&
			child.children.length === 1 &&
			child.children[0].type === ParseTreeTokenType.IDENTIFIER)
				names.add(child.children[0].val);
			else if (child.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
			child.children.length >= 1 &&
			child.children[0].type === ParseTreeTokenType.IDENTIFIER) {
				names.add(child.children[0].val);
			}
		}
		functionDefinition.parameterNameSet = names;
	}
	return functionDefinition.parameterNameSet;
};