import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function shouldBecomeAstrixWildcard(prev, next) {
	if (next.val !== '*')
		return false;
	const parent = prev.parentNode;
	if (parent !== null && parent.type === ParseTreeTokenType.FUNCTION_CALL)
		return false;
	if (prev.type === ParseTreeTokenType.ARGUMENT_LIST) {
		const lastChild = prev.children[prev.children.length - 1];
		if (lastChild !== undefined &&
		(lastChild.type === ParseTreeTokenType.COMMA ||
		lastChild.type === ParseTreeTokenType.CURVED_LEFT_BRACKET))
			return true;
	}
	return prev.type === ParseTreeTokenType.IMPORT;
}

export function processUnaryOperator(prev, next) {
	if (shouldBecomeAstrixWildcard(prev, next))
		next.type = ParseTreeTokenType.ASTRIX_WILDCARD;
	
	prev.appendChild(next);
	return next;
};