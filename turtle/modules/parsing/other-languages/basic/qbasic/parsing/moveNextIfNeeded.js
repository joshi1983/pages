import { findForMatchingName } from
'./findForMatchingName.js';
import { getForLoopVariableName } from
'./parse-tree-analysis/variable-data-types/getForLoopVariableName.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

export function moveNextIfNeeded(token) {
	if (token.type !== ParseTreeTokenType.NEXT)
		return false;
	if (token.children.length !== 1)
		return false;
	const firstChild = token.children[0];
	if (firstChild.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.FOR)
		return false;
	const varName = getForLoopVariableName(parent);
	const nextName = firstChild.val.toLowerCase();
	if (varName === undefined || varName === nextName)
		return false;

	const matchingFor = findForMatchingName(token, nextName);
	if (matchingFor === undefined)
		return false;

	token.remove();
	matchingFor.appendChild(token);
	return true;
};