import { DataTypes } from
'../../data-types/DataTypes.js';
import { getTokensByType } from
'../../generic-parsing-utilities/getTokensByType.js';
import { isExclusivelyString } from
'../command-data-types/isExclusivelyString.js';
import { isNotIntersectingNum } from
'../command-data-types/isNotIntersectingNum.js';
import { isNotIntersectingString } from
'../command-data-types/isNotIntersectingString.js';
import { isNum } from
'../command-data-types/isNum.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

export const interestingVals = new Set([
	'>', '<', '<=', '>=', '=', '<>'
]);

const typeCompliments = [
	[isNum, isNotIntersectingNum, 'number'],
	[isExclusivelyString, isNotIntersectingString, 'string']
];

function getTypeCompatabilityMessage(types1, types2) {
	if (types1 === undefined || types2 === undefined ||
	types1 === null || types2 === null)
		return;

	const types1Str = DataTypes.stringify(types1);
	const types2Str = DataTypes.stringify(types2);
	// distinct type classes are number and string.
	for (const [isType, isNotType, name] of typeCompliments) {
		if (isType(types1Str, types1) && isNotType(types2Str, types2)) {
			return `Left operand is a ${name} but the right operand is not.`;
		}
		if (isType(types2Str, types2) && isNotType(types1Str, types1)) {
			return `Right operand is a ${name} but the left operand is not.`;
		}
	}
}

function shouldSuppressWarningFor(token, cachedParseTree) {
	const children = token.children;
	if (children.length !== 2)
		return true;
		// weird number of operands so a more important error will show anyway.
		// We don't want to show lower priority messages because it becomes
		// distracting, confusing, and noisy.

	const variables = cachedParseTree.getVariables();
	for (const child of children) {
		if (child.type === ParseTreeTokenType.VARIABLE_READ) {
			const name = child.val.toLowerCase();
			const variable = variables.getVariableByName(name);
			if (variable === undefined)
				return true;
			else {
				const procedure = cachedParseTree.getProcedureAtToken(child);
				if (procedure !== undefined) {
					const scopes = variable.getScopesAt(child, procedure);
					if (scopes.some(scope => scope.isParameter))
						return true;
						// if the scope is from a parameter,
						// any value could be passed in.
				}
			}
		}
	}
	return false;
}

function isOfInterest(cachedParseTree) {
	return function(token) {
		if (!interestingVals.has(token.val))
			return false;

		if (shouldSuppressWarningFor(token, cachedParseTree))
			return false;

		return true;
	};
}

export function validateComparisonOperatorDataTypes(cachedParseTree, parseLogger) {
	const operators = getTokensByType(cachedParseTree, ParseTreeTokenType.BINARY_OPERATOR).
		filter(isOfInterest(cachedParseTree));
	const tokenTypes = cachedParseTree.getTokensToDataTypes();
	for (const operatorToken of operators) {
		const leftOperand = tokenTypes.get(operatorToken.children[0]);
		const rightOperand = tokenTypes.get(operatorToken.children[1]);
		const msg = getTypeCompatabilityMessage(leftOperand, rightOperand);
		if (msg !== undefined) {
			parseLogger.warn(`The left and right operands for ${operatorToken.val} are of such different types that comparing can cause confusion.  ${msg}`, operatorToken);
		}
	}
};