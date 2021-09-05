import { declaringTypes } from './parsing/declaringTypes.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { SetUtils } from '../../SetUtils.js';

const typesWithNoSideEffects = new Set([
ParseTreeTokenType.BOOLEAN_LITERAL,
ParseTreeTokenType.IDENTIFIER,
ParseTreeTokenType.NULL,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.SEMICOLON,
ParseTreeTokenType.STRING_LITERAL,
ParseTreeTokenType.UNDEFINED
]);

const typesWithSideEffects = new Set([
ParseTreeTokenType.ASSIGNMENT_OPERATOR,
ParseTreeTokenType.THROW
]);

SetUtils.addAll(typesWithSideEffects, declaringTypes);

function isNoSideEffectFunctionCall(funcCallToken) {
	if (funcCallToken.children.length !== 0) {
		const child = funcCallToken.children[0];
		if (child.val === 'Math')
			return true;
	}
	return false;
}

function mightTemplateLiteralHaveSideEffects(token) {
	const s = token.val;
	if (s.indexOf('${') === -1)
		return false;
	// We could look deeper for function calls in the template symbols.
	// For now, we'll just return true because it just might have side effects.
	return true;
}

export function mightHaveSideEffects(token) {
	if (typesWithNoSideEffects.has(token.type))
		return false;
	if (typesWithSideEffects.has(token.type))
		return true;
	if (token.type === ParseTreeTokenType.TEMPLATE_LITERAL) {
		return mightTemplateLiteralHaveSideEffects(token);
	}
	if (token.type === ParseTreeTokenType.FUNCTION_CALL) {
		if (!isNoSideEffectFunctionCall(token))
			return true;
	}
	for (const child of token.children) {
		if (mightHaveSideEffects(child))
			return true;
	}
	return false;
};