import { flatten } from '../../../../../generic-parsing-utilities/flatten.js';
import { parse } from '../../../../../js-parsing/parse.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

function isIndirectMakeOrLocalmake(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER ||
	(token.val !== 'make' && token.val !== 'localmake') ||
	token.parentNode === null ||
	token.children.length !== 0)
		return false;
	let t = token.parentNode;
	if (t.type !== ParseTreeTokenType.DOT || t.parentNode === null)
		return false;
	t = t.parentNode;
	if (t.type !== ParseTreeTokenType.IDENTIFIER || t.val !== 'context' || t.parentNode === null)
		return false;
	t = t.parentNode;
	if (t.type !== ParseTreeTokenType.FUNCTION_CALL || t.children.length !== 2)
		return false;
	t = t.children[1];
	if (t.type !== ParseTreeTokenType.ARG_LIST || t.children.length < 3)
		return false;
	t = t.children[1];
	if (t.type === ParseTreeTokenType.STRING_LITERAL || t.type === ParseTreeTokenType.TEMPLATE_LITERAL)
		return false;
	return true;
}

export function containsIndirectMakeOrLocalmake(jsCode) {
	const parseResult = parse(jsCode);
	const allTokens = flatten(parseResult.root);
	return allTokens.some(isIndirectMakeOrLocalmake);
};