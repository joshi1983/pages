import { evaluateToken } from
'./evaluateToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const typesToIgnore = new Set([
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
]);

function qbSpace(val) {
	if (!Number.isInteger(val))
		return;
	return ' '.repeat(val);
}

function qbTab(val) {
	if (!Number.isInteger(val))
		return;
	return '\t'.repeat(val);
}

function str(val) {
	return '' + val;
}

function evaluateArgs(tokens) {
	return tokens.filter(t => !typesToIgnore.has(t.type)).
		map(evaluateToken);
}

const funcs = new Map([
	['space$', qbSpace],
	['str', str],
	['str$', str],
	['tab', qbTab],
]);

export function evaluateFunctionCall(token) {
	const children = token.children;
	const firstChild = children[0];
	if (firstChild.type !== ParseTreeTokenType.IDENTIFIER)
		return;
	const f = funcs.get(firstChild.val.toLowerCase());
	if (f === undefined)
		return;
	const vals = evaluateArgs(children[1].children);
	return f(...vals);
};