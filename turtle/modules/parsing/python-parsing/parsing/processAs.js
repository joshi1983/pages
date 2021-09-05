import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const leftOperandTypes = new Set([
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER
]);

function canBeAsLeftOperand(token) {
	if (leftOperandTypes.has(token.type))
		return true;
	return false;
}

function shouldMakePreviousChild(prev) {
	return canBeAsLeftOperand(prev);
}

function getGoodPrevious(prev) {
	let tok = prev;
	while (tok !== undefined) {
		if (canBeAsLeftOperand(tok))
			return tok;

		tok = tok.children[tok.children.length - 1];
	}
	return prev;
}

export function processAs(prev, next) {
	prev = getGoodPrevious(prev);
	if (shouldMakePreviousChild(prev)) {
		const prevParent = prev.parentNode;
		prev.remove();
		prevParent.appendChild(next);
		next.appendChild(prev);
		return next;
	}
	prev.appendChild(next);
	return next;
};