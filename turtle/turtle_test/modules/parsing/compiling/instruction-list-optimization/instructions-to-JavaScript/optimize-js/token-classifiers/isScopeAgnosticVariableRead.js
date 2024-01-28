import { isVariableReadBasic } from './isVariableReadBasic.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

// Checks similar to:
// `context.readVariable("x")`
export function isScopeAgnosticVariableRead(token) {
	if (token.type !== ParseTreeTokenType.STRING_LITERAL)
		return false;
	let p = token.parentNode;
	if (p === null || p.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	p = p.parentNode;
	if (p === null || p.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	p = p.children[0];
	if (p.type !== ParseTreeTokenType.IDENTIFIER || p.val !== 'context' || p.children.length !== 1)
		return false;
	p = p.children[0];
	if (p.type !== ParseTreeTokenType.DOT || p.children.length !== 1)
		return false;
	p = p.children[0];
	if (p.type !== ParseTreeTokenType.IDENTIFIER || p.val !== 'readVariable')
		return false;
	return true;
};