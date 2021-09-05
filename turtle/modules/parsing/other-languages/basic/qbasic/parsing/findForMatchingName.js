import { getForLoopVariableName } from
'./parse-tree-analysis/variable-data-types/getForLoopVariableName.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

export function findForMatchingName(token, nextName) {
	nextName = nextName.toLowerCase();
	token = token.parentNode;
	while (token !== null) {
		if (token.type === ParseTreeTokenType.FOR) {
			const children = token.children;
			const last = children[children.length - 1];
			if (last.type === ParseTreeTokenType.CODE_BLOCK) {
				const forVarName = getForLoopVariableName(token);
				if (forVarName === nextName)
					return token;
			}
		}
		token = token.parentNode;
	}
};