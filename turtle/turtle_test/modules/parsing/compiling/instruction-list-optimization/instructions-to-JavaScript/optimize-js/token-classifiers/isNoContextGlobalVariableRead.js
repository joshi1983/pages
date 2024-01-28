import { isVariableReadBasic } from './isVariableReadBasic.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

// Checks if token represents something like the "x" literal in:
// globalVariables.get("x")
export function isNoContextGlobalVariableRead(token) {
	if (!isVariableReadBasic(token))
		return false;
	let p = token.parentNode;
	if (p === null)
		return false;
	p = p.parentNode;
	if (p === null || p.children.length === 0)
		return false;
	p = p.children[0];
	if (p === null || p.type !== ParseTreeTokenType.IDENTIFIER || p.val !== 'globalVariables' ||
	p.children.length !== 1)
		return false;
	p = p.children[0];
	if (p === null || p.type !== ParseTreeTokenType.DOT || p.children.length !== 1)
		return false;
	p = p.children[0];
	if (p === null || p.type !== ParseTreeTokenType.IDENTIFIER || p.val !== 'get' || p.children.length !== 0)
		return false;
	return true;
};