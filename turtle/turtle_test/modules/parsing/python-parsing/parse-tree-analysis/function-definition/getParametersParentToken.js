import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function getParametersParentToken(functionRootToken) {
	if (functionRootToken.children.length > 2) {
		if (functionRootToken.children[0].type === ParseTreeTokenType.DEF &&
			functionRootToken.children[1].type === ParseTreeTokenType.IDENTIFIER &&
			(
				functionRootToken.children[2].type === ParseTreeTokenType.UNRECOGNIZED ||
				functionRootToken.children[2].type === ParseTreeTokenType.ARGUMENT_LIST
			))
			return functionRootToken.children[2];
	}
	return functionRootToken;
};