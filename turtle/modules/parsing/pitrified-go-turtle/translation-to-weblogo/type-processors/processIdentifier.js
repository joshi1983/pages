import { evaluateToken } from '../../evaluation/evaluateToken.js';
import { filterBracketsAndCommas } from
'./helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

function isFunctionDefinitionArgument(token) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	const grandParent = parent.parentNode;
	if (grandParent.type !== ParseTreeTokenType.FUNC)
		return false;
	return true;
}

function getAssignmentOperator(token) {
	const children = token.children;
	if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR && children.length === 0)
		return token;
	if (children.length >= 0) {
		for (const child of children) {
			const result = getAssignmentOperator(child);
			if (result !== undefined) {
				return result;
			}
		}
	}
}

export function processIdentifier(token, result, settings) {
	const parent = token.parentNode;
	const children = token.children;
	if (children.length === 0 || isFunctionDefinitionArgument(token))
		result.append(`:${token.val} `);
	else {
		const assignmentOperator = getAssignmentOperator(token);
		if (assignmentOperator !== undefined) {
			processToken(assignmentOperator, result, settings);
			return;
		}
		const firstChild = children[0];
		if (firstChild.type === ParseTreeTokenType.ARRAY_SUBSCRIPT) {
			const nonBracketTokens = filterBracketsAndCommas(firstChild.children);
			const indexToken = nonBracketTokens[0];
			if (indexToken !== undefined) {
				// for example, a[x]
				result.append(' item ');
				const indexVal = evaluateToken(indexToken);
				if (Number.isInteger(indexVal)) {
					result.append('' + (indexVal + 1));
				}
				else {
					result.append('(1 + ');
					processToken(indexToken, result, settings);
					result.append(' ) ');
				}
				result.append(' :' + token.val + ' ');
				return;
			}
		}
		processToken(firstChild, result, settings);
	}
};