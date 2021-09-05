import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { processExpressionIndexExpressionAssignmentPrefix } from
'./processExpressionIndexExpressionAssignmentPrefix.js';
import { shouldUseLocalmake } from './shouldUseLocalmake.js';

function isProperty(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.DOT)
		return true;
	else
		return false;
}

function processPropertyAssignmentPrefix(token, result, settings) {
	const objectName = token.parentNode.parentNode.val;
	const propertyName = token.val;
	result.append(`setProperty "${objectName} "${propertyName} `);
}

function processExpressionDotAssignmentPrefix(token, result, settings) {
	const children = token.children;
	const objectName = children[0].val;
	const propertyName = children[1].children[0].val;
	result.append(`setProperty "${objectName} "${propertyName} `);
}

export function processAssignmentPrefix(token, result, settings) {
	if (token.type === ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION)
		processExpressionIndexExpressionAssignmentPrefix(token, result, settings);
	else if (token.type === ParseTreeTokenType.EXPRESSION_DOT)
		processExpressionDotAssignmentPrefix(token, result, settings);
	else if (isProperty(token))
		processPropertyAssignmentPrefix(token, result, settings);
	else {
		if (shouldUseLocalmake(token))
			result.append('local');
		result.append(`make "${token.val} `);
	}
};