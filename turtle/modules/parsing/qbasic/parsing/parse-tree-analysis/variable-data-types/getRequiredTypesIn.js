import { isNumberToken } from './isNumberToken.js';
import { isStringToken } from './isStringToken.js';
import { mightBeDataValue } from './mightBeDataValue.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { QBasicInternalFunctions } from
'../../../QBasicInternalFunctions.js';
import { QBasicOperators } from
'../../../QBasicOperators.js';

function isArgValueToken(token) {
	return mightBeDataValue(token);
}

function getRequiredTypesForOperator(token, parent) {
	const children = parent.children;
	if (children.length === 2) {
		const index = children.indexOf(token);
		const sibling = children[(index + 1) % 2];
		if (isNumberToken(sibling))
			return 'num';
		else if (isStringToken(sibling))
			return 'string';
	}
	const info = QBasicOperators.getOperatorInfo(parent.val);
	if (info !== undefined && info.args !== undefined) {
		const operandIndex = children.indexOf(token);
		const argInfo = info.args[operandIndex];
		if (argInfo !== undefined) {
			return argInfo;
		}
	}

}

function getRequiredTypesForToken(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.BINARY_OPERATOR ||
	parent.type === ParseTreeTokenType.UNARY_OPERATOR) {
		return getRequiredTypesForOperator(token, parent);
	}
	else if (parent.type === ParseTreeTokenType.ARG_LIST) {
		const grandParent = parent.parentNode;
		const firstChild = grandParent.children[0];
		if (firstChild.type === ParseTreeTokenType.IDENTIFIER) {
			const funcInfo = QBasicInternalFunctions.getFunctionInfo(firstChild.val);
			if (funcInfo !== undefined && funcInfo.args !== undefined) {
				const argValueIndex = parent.children.filter(isArgValueToken).indexOf(token);
				const argInfo = funcInfo.args[argValueIndex];
				if (argInfo !== undefined && argInfo.types !== undefined) {
					return argInfo.types;
				}
			}
		}
	}
}

export function getRequiredTypesIn(variableName, token) {
	let result;
	if (token.type === ParseTreeTokenType.IDENTIFIER &&
	token.val.toLowerCase() === variableName) {
		result = getRequiredTypesForToken(token);
	}
	for (const child of token.children) {
		const result1 = getRequiredTypesIn(variableName, child);
		if (result1 !== undefined) {
			result = result1;
		}
	}
	return result;
};