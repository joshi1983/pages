import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

export function isMatchingAParameter(token, variableName) {
	while (token !== null) {
		if (token.type === ParseTreeTokenType.FUNCTION_DEFINITION) {
			const argList = token.children.filter(t => t.type === ParseTreeTokenType.ARGUMENT_LIST)[0];
			for (const c of argList.children) {
				if (c.type === ParseTreeTokenType.IDENTIFIER) {
					if (c.val === variableName)
						return true;
				}
				else if (c.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
				c.val === '=' &&
				c.children.length !== 0) {
					const leftOperand = c.children[0];
					if (leftOperand.val === variableName &&
					leftOperand.children.length === 0 &&
					leftOperand.type === ParseTreeTokenType.IDENTIFIER)
						return true;
				}
			}
		}
		token = token.parentNode;
	}
	return false;
};