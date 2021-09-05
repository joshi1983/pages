import { convertChildren } from './helpers/convertChildren.js';
import { flattenParameters } from './helpers/flattenParameters.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function convertFunctionDefinitionStructures(token) {
	let result = false;
	if (token.type === ParseTreeTokenType.FUNCTION_DEFINITION &&
	token.children.length === 5 &&
	token.children[2].children.length === 3 &&
	token.children[2].children[0].val === '(' &&
	token.children[2].children[1].val === null &&
	token.children[2].children[2].val === ')' &&
	token.children[2].type === ParseTreeTokenType.UNRECOGNIZED) {
		const unrecognizedToken = token.children[2];
		flattenParameters(unrecognizedToken);
		result = true;
	}
	if (convertChildren(token, convertFunctionDefinitionStructures))
		result = true;
	return result;
};