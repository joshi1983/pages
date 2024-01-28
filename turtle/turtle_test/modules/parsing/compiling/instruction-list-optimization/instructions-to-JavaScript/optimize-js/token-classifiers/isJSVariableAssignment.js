import { Operators } from '../../../../../js-parsing/Operators.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

function isUnaryAssignmentOperator(operatorSymbol) {
	const info = Operators.getOperatorInfo(operatorSymbol);
	return info !== undefined &&
		info.unary.isAssignment;
}

export function isJSVariableAssignment(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	if (token.children.length === 1) {
		const child = token.children[0];
		if (child.type !== ParseTreeTokenType.UNARY_OPERATOR ||
		!isUnaryAssignmentOperator(child.val))
			return false;
		if (child.children.length !== 0)
			return false;
		return true;
	}
	else if (token.children.length !== 0)
		return false;
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.UNARY_OPERATOR &&
	parent.children.length === 1 &&
	isUnaryAssignmentOperator(parent.val))
		return true;
	if (parent.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR ||
	parent.children.indexOf(token) !== 0)
		return false;

	return true;
};