import { getDescendentsOfType } from '../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

function mightBeAssignedFromAssignmentOperator(forToken, variableName) {
	// look for assignments to variables with the same name.
	const assignments = getDescendentsOfType(forToken, ParseTreeTokenType.ASSIGNMENT_OPERATOR).
		filter(t => t.children.length === 2 &&
		t.children[0].val === variableName);
	return assignments.length !== 0;
}

function mightBeAssignedFromUnaryOperator(forToken, variableName) {
	const unaryOperators = getDescendentsOfType(forToken, ParseTreeTokenType.UNARY_OPERATOR).
		filter(t => (t.children.length === 1 && t.children[0].val === variableName) ||
			(t.parentNode.type === ParseTreeTokenType.IDENTIFIER && t.parentNode.val === variableName));
	return unaryOperators.length !== 0;
}

export function mightVariableBeMutatedInForLoop(forToken, variableName) {
	return mightBeAssignedFromAssignmentOperator(forToken, variableName) ||
		mightBeAssignedFromUnaryOperator(forToken, variableName);
};