import { mightBeDataValue } from
'./mightBeDataValue.js';
import { Operators } from
'../Operators.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

function shouldBecomeAssignmentOperator(prev, next) {
	if (next.val !== '=' ||
	(prev.type !== ParseTreeTokenType.IDENTIFIER &&
	prev.type !== ParseTreeTokenType.FUNCTION_CALL))
		return false;

	const prevParent = prev.parentNode;
	if (prevParent.type !== ParseTreeTokenType.SET)
		return false;

	return true;
}

function shouldBecomeUnary(prev, next) {
	const operatorInfo = Operators.getOperatorInfo(next.val.toLowerCase());
	if (operatorInfo.unary === undefined)
		return false;

	const children = prev.children;
	const lastChild = children[children.length - 1];
	if (prev.type === ParseTreeTokenType.ARG_LIST) {
		if (lastChild === undefined ||
		(lastChild !== undefined &&
		lastChild.type === ParseTreeTokenType.COMMA))
			return true;
	}

	if ((prev.type === ParseTreeTokenType.BINARY_OPERATOR ||
	prev.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) &&
	prev.children.length < 2)
		return true;

	if ((prev.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION ||
	prev.type === ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION) &&
	prev.children.length < 2)
		return true;

	return false;
}

export function processBinaryOperator(prev, next) {
	if (shouldBecomeAssignmentOperator(prev, next)) {
		next.type = ParseTreeTokenType.ASSIGNMENT_OPERATOR;
		const setToken = prev.parentNode;
		const leftOperand = prev;
		leftOperand.remove();
		next.appendChild(leftOperand);
		setToken.appendChild(next);
		return next;
	}
	else if (shouldBecomeUnary(prev, next)) {
		next.type = ParseTreeTokenType.UNARY_OPERATOR;
		prev.appendChild(next);
		return next;
	}
	while (prev.children.length !== 0 &&
	!mightBeDataValue(prev)) {
		const lastChild = prev.children[prev.children.length - 1];
		prev = lastChild;
	}
	const prevParent = prev.parentNode;
	if (prevParent === null) {
		prev.appendChild(next);
		return next;
	}
	prev.remove();
	next.appendChild(prev);
	prevParent.appendChild(next);
	return next;
};