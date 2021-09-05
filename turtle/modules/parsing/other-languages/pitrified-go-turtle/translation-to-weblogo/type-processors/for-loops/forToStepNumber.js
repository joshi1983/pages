import { evaluateToken } from
'../../../evaluation/evaluateToken.js';
import { forToIncrementToken } from
'./forToIncrementToken.js';
import { forToInitToken } from
'./forToInitToken.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

function getOperatorName(token) {
	if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return token.val;
	if (token.type === ParseTreeTokenType.IDENTIFIER) {
		const children = token.children;
		if (children.length === 1) {
			const firstChild = children[0];
			if (firstChild !== undefined)
				return firstChild.val;
		}
		else if (children.length === 0) {
			const parent = token.parentNode;
			if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
				return parent.val;
		}
	}
}

// Will return true for tokens corresponding with code like x++, x--, x+=2, x*=2
// Will return false for tokens corresponding with code like ++x++, ++x--
function isSimpleCase(token) {
	if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	token.children.length === 1)
		token = token.children[0];
	
	const parent = token.parentNode;
	const children = token.children;
	const firstChild = children[0];
	if (token.type === ParseTreeTokenType.IDENTIFIER &&
	firstChild !== undefined && firstChild.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	parent.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return true;
	if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	firstChild === undefined)
		return true;
	return false;
}

function getComplexStepNumber(token) {
	let result = 0;
	if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	token.children.length === 1) {
		if (token.val === '++')
			result++;
		else if (token.val === '--')
			result--;
		token = token.children[0];
	}
	const children = token.children;
	const firstChild = children[0];
	if (firstChild.val === '++')
		result++;
	else if (firstChild.val === '--')
		result--;
	return result;
}

export function forToStepNumber(forToken) {
	const incrementToken = forToIncrementToken(forToken);
	if (incrementToken === undefined) {
		const initToken = forToInitToken(forToken);
		if (initToken !== undefined && initToken.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
			const rightOperand = initToken.children[1];
			if (rightOperand !== undefined && rightOperand.type === ParseTreeTokenType.RANGE)
				return 1;
		}
		return;
	}
	if (incrementToken.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR ||
	incrementToken.type === ParseTreeTokenType.IDENTIFIER) {
		const val = getOperatorName(incrementToken);
		const isSimple = isSimpleCase(incrementToken);
		if (val === undefined)
			return;
		if (isSimple) {
			if (val === '++')
				return 1;
			if (val === '--')
				return -1;
		}
		else if (val === '++' || val === '--') {
			return getComplexStepNumber(incrementToken);
		}
		const rightChild = incrementToken.children[1];
		if (rightChild === undefined)
			return;
		const rightVal = evaluateToken(rightChild);
		if (rightVal === undefined)
			return;
		if (val === '+=')
			return rightVal;
		if (val === '-=')
			return -rightVal;
	}
};