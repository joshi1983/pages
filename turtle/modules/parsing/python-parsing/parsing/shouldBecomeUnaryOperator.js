import { getSortedLastDescendentTokenOf } from '../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { PythonOperators } from '../PythonOperators.js';

const unaryPreviousIndicators = new Set([
	ParseTreeTokenType.ARGUMENT_LIST,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.UNARY_OPERATOR
]);

export function shouldBecomeUnaryOperator(prev, next) {
	if (next.type !== ParseTreeTokenType.BINARY_OPERATOR)
		return false;

	const info = PythonOperators.getOperatorInfo(next.val);
	if (info !== undefined && info.unary !== undefined) {
		const last = getSortedLastDescendentTokenOf(prev);
		if (unaryPreviousIndicators.has(last.type))
			return true;
		if (last.val === 'print' && last.parentNode.val !== '.')
			return true; // for the Python 2-style print statements that don't wrap parameters in (...) brackets.
	}
	return false;
};