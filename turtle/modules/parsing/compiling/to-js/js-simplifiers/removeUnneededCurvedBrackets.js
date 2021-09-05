import { filterBracketsAndCommas } from
'../../../js-parsing/translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { Operators } from
'../../../js-parsing/Operators.js';
import { ParseTreeTokenType } from
'../../../js-parsing/ParseTreeTokenType.js';

function isOfInterest(expression) {
	const children = expression.children;
	if (children.some(t => t.type === ParseTreeTokenType.COMMA) ||
	children.length !== 3)
		return false;

	const valChildren = filterBracketsAndCommas(children);
	if (valChildren.length !== 1)
		return false;

	const valToken = valChildren[0];
	if (valToken.children.length === 0)
		return true;

	if (valToken.type === ParseTreeTokenType.ARRAY_LITERAL ||
	valToken.type === ParseTreeTokenType.FUNCTION_CALL ||
	valToken.type === ParseTreeTokenType.UNARY_OPERATOR)
		return true;

	const parent = expression.parentNode;
	if (parent.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION ||
	parent.type === ParseTreeTokenType.ARG_LIST ||
	parent.type === ParseTreeTokenType.ARRAY_LITERAL)
		return true;

	if (parent.type === ParseTreeTokenType.BINARY_OPERATOR) {
		if (valToken.type === ParseTreeTokenType.BINARY_OPERATOR) {
			const op1 = Operators.getOperatorInfo(parent.val);
			const op2 = Operators.getOperatorInfo(valToken.val);
			return op1.precedence <= op2.precedence;
		}
	}

	return false;
}

function removeBrackets(expression) {
	const firstChild = expression.children[0];
	if (firstChild.type === ParseTreeTokenType.CURVED_LEFT_BRACKET)
		firstChild.remove();
	const lastChild = expression.children[expression.children.length - 1];
	if (lastChild.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET)
		lastChild.remove();
	if (expression.children.length === 1)
		expression.removeSingleToken();
}

export function removeUnneededCurvedBrackets(root) {
	const expressions = getDescendentsOfType(root, ParseTreeTokenType.CURVED_BRACKET_EXPRESSION).
		filter(isOfInterest);
	expressions.forEach(function(expression) {
		removeBrackets(expression);
	});
	return expressions.length !== 0;
};