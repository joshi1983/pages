import { declaringTypes } from
'../../../../../../../parsing/js-parsing/parsing/declaringTypes.js';
import { getInitialToken } from './getInitialToken.js';
import { ParseTreeTokenType } from
'../../../../../../../parsing/js-parsing/ParseTreeTokenType.js';

function getVariableNameFromAssignment(assignToken) {
	if (assignToken.children.length !== 0) {
		const varNameToken = assignToken.children[0];
		if (typeof varNameToken.val === 'string')
			return varNameToken.val;
	}
}

function getVariableNameFromUnaryOperator(op) {
	if (op.children.length !== 0)
		return op.children[0].val;
	else {
		const parent = op.parentNode;
		if (parent.type === ParseTreeTokenType.IDENTIFIER)
			return parent.val;
	}
}

function getVariableNameFromInitializationToken(initToken) {
	if (declaringTypes.has(initToken.type)) {
		if (initToken.children.length > 1)
			return;
			// declaring more than 1 variable means 
			// returning only 1 would be an oversimplification.

		const child = initToken.children[0];
		if (child.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
			return getVariableNameFromAssignment(child);
		else if (child.val === '++' || child.val === '--')
			return getVariableNameFromUnaryOperator(child);
		else if (child.type === ParseTreeTokenType.IDENTIFIER)
			return child.val;
	}
	else if (initToken.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return getVariableNameFromAssignment(initToken);
	else if (initToken.type === ParseTreeTokenType.UNARY_OPERATOR)
		return getVariableNameFromUnaryOperator(initToken);
	else if (initToken.type === ParseTreeTokenType.IDENTIFIER)
		return initToken.val;
}

export function getVariableNameFromForToken(forToken) {
	const initializationToken = getInitialToken(forToken);
	if (initializationToken !== undefined) {
		const potentialResult = getVariableNameFromInitializationToken(initializationToken);
		if (typeof potentialResult === 'string')
			return potentialResult;
	}
};