import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function getVariableNameFromInitToken(initToken) {
	if (initToken === undefined)
		return;
	if (initToken.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return initToken.children[0].val;
};