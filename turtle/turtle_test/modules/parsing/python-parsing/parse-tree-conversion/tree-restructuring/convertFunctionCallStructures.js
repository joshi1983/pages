import { convertChildren } from './helpers/convertChildren.js';
import { flattenParameters } from './helpers/flattenParameters.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function convertFunctionCallStructures(token) {
	let result = false;
	if ((token.type === ParseTreeTokenType.FUNCTION_CALL) &&
	token.children.length === 1 &&
	token.children[0].type === ParseTreeTokenType.UNRECOGNIZED &&
	token.children[0].children.length > 0 &&
	token.children[0].children[0].val !== '[') {
		const unrecognizedToken = token.children[0];
		token.removeChild(unrecognizedToken);
		while (unrecognizedToken.children.length !== 0)
			token.appendChild(unrecognizedToken.children[0]);
		flattenParameters(token);
		result = true;
	}
	if (convertChildren(token, convertFunctionCallStructures))
		result = true;

	return result;
};