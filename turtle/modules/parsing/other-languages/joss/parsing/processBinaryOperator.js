import { isCompleteBracketed } from
'./isCompleteWithNext.js';
import { Operators } from
'../Operators.js';
import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

function isCompleteBracketedArgList(token) {
	const children = token.children;
	return token.type === ParseTreeTokenType.ARG_LIST &&
		isCompleteBracketed(token);
}

function shouldBecomeAssignmentOperator(prev, next) {
	if (next.val !== '=')
		return false;

	if (prev.type === ParseTreeTokenType.LET &&
	prev.children.length === 1) {
		const funcCall = prev.children[0];
		if (funcCall.type === ParseTreeTokenType.FUNCTION_CALL)
			return true;
	}
	if (prev.type !== ParseTreeTokenType.IDENTIFIER &&
	prev.type !== ParseTreeTokenType.FUNCTION_CALL)
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
		if (prev.type === ParseTreeTokenType.LET) {
			prev = prev.children[0];
		}
		const setToken = prev.parentNode;
			// setToken could be a SET or LET token.
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
	!isCompleteBracketed(prev)) {
		const lastChild = prev.children[prev.children.length - 1];
		prev = lastChild;
	}
	let prevParent = prev.parentNode;
	if (prevParent === null) {
		prev.appendChild(next);
		return next;
	}
	if (isCompleteBracketedArgList(prev)) {
		const curvedBracketExpression = new ParseTreeToken(null, prev.lineIndex, prev.colIndex,
		ParseTreeTokenType.CURVED_BRACKET_EXPRESSION);
		const argList = prev;
		while (prev.children.length !== 0) {
			const child = prev.children[0];
			child.remove();
			curvedBracketExpression.appendChild(child);
		}
		argList.appendChild(curvedBracketExpression);
		prev = curvedBracketExpression;
		prevParent = prev.parentNode;
	}
	prev.remove();
	next.appendChild(prev);
	prevParent.appendChild(next);
	return next;
};