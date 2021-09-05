import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function demand(token, result) {
	if (token.children.length !== 2)
		return false;

	const variableTokens = token.children[1].children.filter(t => t.type === ParseTreeTokenType.IDENTIFIER);
	for (const variable of variableTokens) {
		result.append(`\nmake "${variable.val} 0\n`);
	}
	
	return true;
};