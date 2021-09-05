import { canEvaluateToDataValue } from
'./canEvaluateToDataValue.js';
import { Operators } from '../Operators.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function shouldBecomeUnary(prev, next) {
	const info = Operators.getOperatorInfo(next.val);
	if (info.unary === undefined)
		return false;
	if (info.isNotBinary === true)
		return true;
	if (canEvaluateToDataValue(prev))
		return false;
	return true;
}

function shouldBecomeEndMatchSymbol(prev, next) {
	if (next.val !== '*')
		return false;
	
	if (prev.type === ParseTreeTokenType.BINARY_OPERATOR) {
		if (prev.val === '..')
			return true;
		return false;
	}
	if (prev.type === ParseTreeTokenType.ARG_LIST)
		return true;

	return false;
}

export function processBinaryOperator(prev, next) {
	const prevParent = prev.parentNode;
	if (shouldBecomeEndMatchSymbol(prev, next)) {
		next.type = ParseTreeTokenType.END_MATCH_SYMBOL;
		prev.appendChild(next);
		return next;
	}
	else if (shouldBecomeUnary(prev, next)) {
		next.type = ParseTreeTokenType.UNARY_OPERATOR;
	}
	if (prevParent === null ||
	next.type === ParseTreeTokenType.UNARY_OPERATOR) {
		prev.appendChild(next);
	}
	else {
		prev.remove();
		next.appendChild(prev);
		prevParent.appendChild(next);
	}
	return next;
};