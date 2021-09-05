import { mightBeDataValueToken } from './mightBeDataValueToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const badFirstOperandTypes = new Set([
	ParseTreeTokenType.ARGUMENT_LIST,
	ParseTreeTokenType.ASSERT,
	ParseTreeTokenType.ASYNC,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.FOR_LOOP,
	ParseTreeTokenType.FUNCTION_DEFINITION,
	ParseTreeTokenType.GLOBAL,
	ParseTreeTokenType.IMPORT,
	ParseTreeTokenType.PASS,
	ParseTreeTokenType.RETURN,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.TRY,
	ParseTreeTokenType.WHILE_LOOP,
	ParseTreeTokenType.WITH,
]);

function isGoodPrevious(prev, next) {
	if (prev.parentNode === null)
		return true;
	if (next.val === '*' && prev.type === ParseTreeTokenType.IMPORT &&
	prev.lineIndex === next.lineIndex)
		return true;
	if (badFirstOperandTypes.has(prev.type))
		return false;
	return true;
}

function getGoodPrevious(prev, next) {
	let tok = prev;
	while (tok !== undefined) {
		if (mightBeDataValueToken(tok)) {
			prev = tok;
			break;
		}
		tok = tok.children[tok.children.length - 1];
	}	
	while (!isGoodPrevious(prev, next)) {
		prev = prev.parentNode;
	}
	return prev;
}

function shouldBecomeAstrixWildcard(prev, next) {
	if (next.val !== '*')
		return false;
	return prev.type === ParseTreeTokenType.IMPORT;
}

export function processBinaryOperator(prev, next) {
	if (shouldBecomeAstrixWildcard(prev, next)) {
		next.type = ParseTreeTokenType.ASTRIX_WILDCARD;
		prev.appendChild(next);
		return prev;
	}
	prev = getGoodPrevious(prev, next);
	if (prev.parentNode === null) {
		prev.appendChild(next);
	}
	else {
		const newParent = prev.parentNode;
		newParent.replaceChild(prev, next);
		next.appendChild(prev);
	}	
	return next;
};