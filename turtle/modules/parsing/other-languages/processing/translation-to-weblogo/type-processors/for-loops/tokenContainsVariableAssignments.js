import { forTokenToInitVariableName } from './forTokenToInitVariableName.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

const mutatingUnaryVals = new Set(['++', '--']);

export function tokenContainsVariableAssignments(token, variableName) {
	if (token.type === ParseTreeTokenType.IDENTIFIER) {
		const parent = token.parentNode;
		if (token.val === variableName) {
			if (parent.type === ParseTreeTokenType.UNARY_OPERATOR &&
			mutatingUnaryVals.has(parent.val))
				return true;
			if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
			parent.children.indexOf(token) === 0) {
				return true;
			}
			if (token.children.length === 1) {
				const child = token.children[0];
				if (child.type === ParseTreeTokenType.UNARY_OPERATOR &&
				mutatingUnaryVals.has(child.val))
					return true;
			}
		}
	}
	else if (token.type === ParseTreeTokenType.FOR) {
		const controlVariableName = forTokenToInitVariableName(token);
		if (controlVariableName === variableName) {
			return false;
		}
	}
	for (const child of token.children) {
		if (tokenContainsVariableAssignments(child, variableName))
			return true;
	}
	return false;
};