import { evaluateToken } from
'../../../parsing/parse-tree-analysis/variable-data-types/evaluation/evaluateToken.js';
import { forToStepToken } from
'./forToStepToken.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

const acceptableStartTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.EXPRESSION_DOT,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.UNARY_OPERATOR
]);

export function forToStepValue(forToken) {
	const stepToken = forToStepToken(forToken);
	if (stepToken === null)
		return;

	if (!acceptableStartTypes.has(stepToken.type))
		return;

	let unaryOperator = stepToken;
	
	// for example, p.x++
	while (unaryOperator.type === ParseTreeTokenType.EXPRESSION_DOT &&
	unaryOperator.children.length === 2 &&
	unaryOperator.children[1].children.length === 1)
		unaryOperator = unaryOperator.children[1].children[0];

	// for example, x++
	if (unaryOperator.type === ParseTreeTokenType.IDENTIFIER &&
	unaryOperator.children.length === 1)
		unaryOperator = unaryOperator.children[0];

	// for example, ++x, --x
	if (unaryOperator.type === ParseTreeTokenType.UNARY_OPERATOR) {
		if (unaryOperator.val === '++')
			return 1;
		if (unaryOperator.val === '--')
			return -1;
	}

	// for example, x+=2, x-=2
	if (stepToken.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	stepToken.children.length === 2) {
		const rightOperand = stepToken.children[1];
		const val = evaluateToken(rightOperand);
		if (val !== undefined) {
			if (stepToken.val === '+='){
				return val;
			}
			else if (stepToken.val === '-=')
				return -val;
		}			
	}
	return;
};