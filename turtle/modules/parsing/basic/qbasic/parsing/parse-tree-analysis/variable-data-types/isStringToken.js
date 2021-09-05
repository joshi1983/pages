import { declarationToTypeName } from './declarationToTypeName.js';
import { evaluateToken } from '../../../evaluation/evaluateToken.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { QBasicInternalFunctions } from '../../../QBasicInternalFunctions.js';

const definiteStringTypes = new Set([
	ParseTreeTokenType.STRING_LITERAL
]);

export function isStringToken(token, options, stopRecursionTokens) {
	const val = evaluateToken(token);
	if (val !== undefined)
		return typeof val === 'string';
	if (stopRecursionTokens === undefined)
		stopRecursionTokens = new Set([token]);
	else if (stopRecursionTokens.has(token))
		return false; // must stop recursion now.
	else {
		stopRecursionTokens = new Set(stopRecursionTokens);
		stopRecursionTokens.add(token);
	}

	const children = token.children;
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR) {
		if (token.val !== '+' || token.children.length !== 2)
			return false;
		if (isStringToken(children[0], options, stopRecursionTokens) ||
		isStringToken(children[1], options, stopRecursionTokens))
			return true;
	}
	else if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
		if (children.length < 2)
			return false;
		return isStringToken(children[1], options, stopRecursionTokens);
	}
	else if (token.type === ParseTreeTokenType.FUNCTION_CALL) {
		const firstChild = token.children[0];
		if (firstChild.type === ParseTreeTokenType.IDENTIFIER) {
			const functionsMap = new Map();
			const info = QBasicInternalFunctions.getFunctionInfo(firstChild.val, functionsMap);
			if (info !== undefined) {
				if (info.returnTypes === 'string')
					return true;
				if (info.returnTypes === null || info.returnTypes === 'list' || info.returnTypes === 'int' ||
				info.returnTypes === 'num')
					return false;
			}
		}
	}
	else if (token.type === ParseTreeTokenType.IDENTIFIER && options !== undefined) {
		const variable = options.variables.get(token.val.toLowerCase());
		if (variable !== undefined) {
			const declaration = variable.getDeclarationAt(token);
			if (declaration !== undefined) {
				const typeName = declarationToTypeName(declaration);
				if (typeName !== undefined) {
					return typeName === 'string';
				}
			}
			const assignment = variable.getAssignmentBefore(token);
			if (assignment !== undefined) {
				const parent = assignment.parentNode;
				if (parent.type === ParseTreeTokenType.ARG_LIST) {
					const grandParent = parent.parentNode;
					const fNameToken = grandParent.children[0];
					if (fNameToken.type === ParseTreeTokenType.IDENTIFIER &&
					fNameToken.val.toLowerCase() === 'input') {
						const varName = assignment.val.toLowerCase();
						// if there is a data-type-indicating suffix on the variable name,
						// rely on that to determine if the variable is a string.
						if (varName.endsWith('$'))
							return true;
						if ('&%!#'.indexOf(varName[varName.length - 1]) !== -1)
							return false;
						return false; // don't have enough confidence to return true.
					}
					return true;
				}
				else if (parent.type === ParseTreeTokenType.BINARY_OPERATOR &&
				parent.val.toLowerCase() === 'to')
					return false; // for-loop counter variable
				const rightToken = assignment.children[1];
				if (rightToken !== undefined)
					return isStringToken(rightToken, options, stopRecursionTokens);
			}
		}
	}
	return definiteStringTypes.has(token.type);
};