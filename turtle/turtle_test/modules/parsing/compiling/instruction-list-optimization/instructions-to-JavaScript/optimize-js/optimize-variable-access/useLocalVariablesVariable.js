import { flatten } from '../../../../../generic-parsing-utilities/flatten.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

// Converts stuff like
// context.getCurrentExecutingProcedure().localVariables.get("x")
// to
// localVariables.get("x")
function isIndirectLocalVariablesReference(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER || token.val !== 'localVariables')
		return false;
	let p = token.parentNode;
	if (p.type !== ParseTreeTokenType.DOT)
		return false;
	p = p.parentNode;
	if (p.type !== ParseTreeTokenType.EXPRESSION_DOT)
		return false;
	p = p.children[0];
	if (p.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	p = p.children[0];
	if (p.type !== ParseTreeTokenType.IDENTIFIER ||
	p.val !== 'context')
		return false;

	return true;
}

function processIndirectLocalVariablesReferences(tokens) {
	const refs = tokens.filter(isIndirectLocalVariablesReference);
	refs.forEach(function(ref) {
		const ancestor = ref.parentNode.parentNode;
		const p = ancestor.parentNode;
		ref.remove();
		p.replaceChild(ancestor, ref);
	});
}

function isLocalmakeCall(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER || token.val !== 'localmake')
		return false;
	let p = token.parentNode;
	if (p.type !== ParseTreeTokenType.DOT)
		return false;
	p = p.parentNode;
	if (p.type !== ParseTreeTokenType.IDENTIFIER || p.val !== 'context')
		return false;
	p = p.parentNode;
	if (p.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	return true;
}

// converts stuff like
// context.localmake("x", 1)
// to
// localVariables.set("x", 1)
function inlineLocalmakeCalls(tokens) {
	const localmakeCalls = tokens.filter(isLocalmakeCall);
	localmakeCalls.forEach(function(call) {
		const contextToken = call.parentNode.parentNode;
		contextToken.val = 'localVariables';
		contextToken.originalString = contextToken.val;
		call.val = 'set';
		call.originalString = call.val;
	});
}

export function useLocalVariablesVariable(rootToken) {
	const tokens = flatten(rootToken);
	inlineLocalmakeCalls(tokens);
	processIndirectLocalVariablesReferences(tokens);
}