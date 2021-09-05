import { getForLoopVariableName } from
'./parse-tree-analysis/variable-data-types/getForLoopVariableName.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function findMatchingNext(tok, variableName) {
	while (true) {
		const children = tok.children;
		if (children.length === 0)
			return;
		if (tok.type === ParseTreeTokenType.NEXT) {
			for (const child of children) {
				if (child.type === ParseTreeTokenType.IDENTIFIER &&
				child.val.toLowerCase() === variableName)
					return tok;
			}
			return;
		}
		const last = children[children.length - 1];
	}
}

export function isCompleteForToken(token) {
	if (token.type !== ParseTreeTokenType.FOR)
		return false;
	const children = token.children;
	if (children.length < 2)
		return false;
	const last = children[children.length - 1];
	if (last.type === ParseTreeTokenType.NEXT)
		return true;
	if (last.type === ParseTreeTokenType.CODE_BLOCK) {
		const variableName = getForLoopVariableName(token);
		if (typeof variableName === 'string')
			return findMatchingNext(last, variableName) !== undefined;
	}
	return false;
};