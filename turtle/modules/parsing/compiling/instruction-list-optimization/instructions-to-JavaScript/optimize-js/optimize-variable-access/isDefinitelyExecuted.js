import { declaringTypes } from '../../../../../js-parsing/parsing/declaringTypes.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';
import { SetUtils } from '../../../../../../SetUtils.js';

const continueTypes = new Set([
ParseTreeTokenType.ARG_LIST,
ParseTreeTokenType.ASSIGNMENT_OPERATOR,
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.FUNCTION_CALL,
ParseTreeTokenType.UNARY_OPERATOR
]);
SetUtils.addAll(continueTypes, declaringTypes);

export function isDefinitelyExecuted(token) {
	for (token = token.parentNode;token !== null;token = token.parentNode) {
		if (token.type === ParseTreeTokenType.CODE_BLOCK) {
			if (token.parentNode.type === ParseTreeTokenType.IF)
				return false;
			continue;
		}
		if (continueTypes.has(token.type))
			continue;
		if (token.type === ParseTreeTokenType.TREE_ROOT)
			return true;
		if (token.parentNode.type === ParseTreeTokenType.BINARY_OPERATOR) {
			const parent = token.parentNode;
			if (parent.children.indexOf(token) === 0)
				continue;
			if (parent.val === '&&' || parent.val === '||') {
				// The right side operand may not be evaluated for expressions involving && and ||.
				return false;
			}
			continue;
		}
		return false;
	}
	return true;
};