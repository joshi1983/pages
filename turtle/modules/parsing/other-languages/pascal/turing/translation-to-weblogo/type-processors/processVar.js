import { getPotentialVariableReferences } from
'../../parsing/parse-tree-analysis/getPotentialVariableReferences.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from
'./processToken.js';
import { shouldBeLocal } from
'./helpers/shouldBeLocal.js';
import { valueToLiteralCode } from
'../../../../../../valueToLiteralCode.js';

// This is similar to getVariableNames in processAssignmentOperator
// but that code isn't reused here.
// The reason to not reuse the other function is that the specified token is of different types.
// It seems overall more problematic to make a single function handle 
// the ways both token types work.
function getVariableNames(token) {
	const first = token.children[0];
	if (first.type === ParseTreeTokenType.IDENTIFIER) {
		if (first.children.length === 0)
			return [first.val];
	}
	else if (first.type === ParseTreeTokenType.COMMA_LIST) {
		return first.children.filter(c => c.type === ParseTreeTokenType.IDENTIFIER &&
		c.children.length === 0).map(c => c.val);
	}
	return [];
}

function getInitialValueForDataTypeExpressionChild(dteChildToken) {
	while (dteChildToken.val === null &&
	dteChildToken.children.length !== 0)
		dteChildToken = dteChildToken.children[0];

	if (typeof dteChildToken.val === 'string') {
		const lowerCase = dteChildToken.val.toLowerCase();
		if (dteChildToken.type === ParseTreeTokenType.CONTAINER_TYPE &&
		lowerCase === 'array')
			return [];
		else if (lowerCase === 'boolean')
			return false;
		else if (lowerCase === 'string' ||
		(lowerCase === 'char' && dteChildToken.children.length !== 0)) {
			return '';
		}
		else if (lowerCase === 'char')
			return ' ';
	}
	return 0;
}

export function processVar(token, result) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	const lastChild = children[children.length - 1];
	if (lastChild !== undefined) {
		if (lastChild.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
			processToken(lastChild, result);
		else if (lastChild.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION) {
			const firstChild = lastChild.children[0];
			if (firstChild !== undefined) {
				const variableNames = getVariableNames(token);
				const commandName = shouldBeLocal(token) ? 'localmake' : 'make';
				const initValueStr = valueToLiteralCode(getInitialValueForDataTypeExpressionChild(firstChild));
				for (const name of variableNames) {
					const refs = getPotentialVariableReferences(token, name);
					if (refs.length !== 0) {
						result.append(`\n${commandName} ${valueToLiteralCode(name)} ${initValueStr}`);
					}
				}
				result.append('\n');
			}
		}
	}
};