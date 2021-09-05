import { evaluateToken } from '../../evaluation/evaluateToken.js';
import { getMakeCommandFor } from './assignments/getMakeCommandFor.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';
import { typesToInitialValue } from './helpers/typesToInitialValue.js';
import { valueToLiteralCode } from '../../../../valueToLiteralCode.js';

function getLengthFromSubscript(subscriptToken) {
	const child = subscriptToken.children[1];
	if (child === undefined || child.type !== ParseTreeTokenType.NUMBER_LITERAL)
		return;

	const val = evaluateToken(child);
	if (Number.isInteger(val))
		return val;
};

function shouldHandleAsArrayInitialization(token) {
	const firstChild = token.children[0];
	if (firstChild.type === ParseTreeTokenType.ARRAY_LITERAL ||
	firstChild.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION) {
		const childChildren = firstChild.children;
		if (childChildren.length !== 2)
			return false;

		const arraySubscript = childChildren[0];
		if (arraySubscript.type !== ParseTreeTokenType.ARRAY_SUBSCRIPT &&
		arraySubscript.type !== ParseTreeTokenType.ARRAY_SUBSCRIPTS)
			return false;
		
		return true;
	}
	return false;
}

function processVariableInitialization(token, result, settings) {
	if (shouldHandleAsArrayInitialization(token)) {
		const firstChild = token.children[0];
		const childChildren = firstChild.children;
		const arraySubscript = childChildren[0];
		const numDuplicates = getLengthFromSubscript(arraySubscript);
		if (numDuplicates === undefined)
			return;

		const types = childChildren[1];
		const val = typesToInitialValue(types);
		if (numDuplicates !== 0 && val === undefined)
			return;

		const makeCommand = getMakeCommandFor(token, token.val);
		result.append(`\n${makeCommand} "${token.val} `);
		if (numDuplicates === 0)
			result.append('[]');
		else {
			if (numDuplicates === 1)
				result.append(`[ ${valueToLiteralCode(val)} ]`);
			else
				result.append(`duplicate ${valueToLiteralCode(val)} ${numDuplicates}\n`);
		}
		result.append('\n');
	}
}

export function processVar(token, result, settings) {
	const children = token.children;
	for (const child of children) {
		if (child.type === ParseTreeTokenType.IDENTIFIER &&
		child.children.length !== 0)
			processVariableInitialization(child, result, settings);
		else
			processToken(child, result, settings);
	}
};