import { declarationToTypeName } from './declarationToTypeName.js';
import { evaluateToken } from '../../../evaluation/evaluateToken.js';
import { isNumber } from '../../../../../../../isNumber.js';
import { numberNames } from './numberNames.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { QBasicInternalFunctions } from '../../../QBasicInternalFunctions.js';
import { unwrapCurvedBracketExpression } from
'./unwrapCurvedBracketExpression.js';

export const possiblyBitwiseOperators = new Set([
	'and', 'or'
]);

const definiteNumberTypes = new Set([
	ParseTreeTokenType.NUMBER_LITERAL
]);

function isForLoopNextVariable(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	const parent = token.parentNode;
	return parent.type === ParseTreeTokenType.NEXT;
}

/*
maxDepth is used to prevent infinite recursion.
*/
export function isNumberToken(token, options, maxDepth) {
	if (maxDepth === undefined)
		maxDepth = 3;
	else if (maxDepth < 0)
		return false;

	token = unwrapCurvedBracketExpression(token);
	if (isForLoopNextVariable(token))
		return false;
	const val = evaluateToken(token);
	if (val !== undefined)
		return isNumber(val);

	maxDepth--;
	const children = token.children;
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR) {
		if (token.val === '-' &&
		token.parentNode.type === ParseTreeTokenType.DEF_PRIMITIVE)
			return false; // a definition in variable range is not a numeric expression.

		if (token.val === '+' || children.length !== 2 ||
		token.val.toLowerCase() === 'to')
			return false;
		const parent = token.parentNode;
		if (token.val === '=' && parent.type === ParseTreeTokenType.BINARY_OPERATOR &&
		parent.val.toLowerCase() === 'to')
			return false; // The '=' in the initialization of a for-loop shouldn't count as a numeric expression.

		if (children.length === 2 &&
		possiblyBitwiseOperators.has(token.val.toLowerCase())) {
			if (isNumberToken(children[0], options, maxDepth) ||
			isNumberToken(children[1], options, maxDepth))
				return true;
			return false;
		}

		return true;
	}
	else if (token.type === ParseTreeTokenType.FUNCTION_CALL) {
		const firstChild = token.children[0];
		if (firstChild.type === ParseTreeTokenType.IDENTIFIER) {
			const functionsMap = new Map();
			const info = QBasicInternalFunctions.getFunctionInfo(firstChild.val, functionsMap);
			if (info !== undefined) {
				if (info.returnTypes === 'num' || info.returnTypes === 'int')
					return true;
				if (info.returnTypes === null || info.returnTypes === 'list' || info.returnTypes === 'string')
					return false;
			}
		}
	}
	else if (token.type === ParseTreeTokenType.IDENTIFIER &&
	options !== undefined) {
		const parent = token.parentNode;
		if (parent.val === '-' && parent.type === ParseTreeTokenType.BINARY_OPERATOR &&
		parent.parentNode.type === ParseTreeTokenType.DEF_PRIMITIVE)
			return false; // a variable declaration is not a number.

		const variable = options.variables.get(token.val.toLowerCase());
		if (variable !== undefined) {
			const declaration = variable.getDeclarationAt(token);
			if (declaration !== undefined) {
				const typeName = declarationToTypeName(declaration);
				if (typeName !== undefined) {
					if (numberNames.has(typeName))
						return true;
					else
						return false;
				}
			}
			const assignment = variable.getAssignmentBefore(token);
			if (assignment !== undefined) {
				const parent = assignment.parentNode;
				if (parent.type === ParseTreeTokenType.BINARY_OPERATOR &&
				parent.val.toLowerCase() === 'to')
					return true; // for-loop counter variable
				const rightToken = assignment.children[1];
				if (rightToken !== undefined && rightToken !== token)
					return isNumberToken(rightToken, options, maxDepth);
			}
		}
	}
	return definiteNumberTypes.has(token.type);
};