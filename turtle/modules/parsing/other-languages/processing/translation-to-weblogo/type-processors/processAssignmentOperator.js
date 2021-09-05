import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processAssignmentPrefix } from './operators/processAssignmentPrefix.js';
import { processReadExpression } from './operators/processReadExpression.js';
import { processSpecialAssignmentOperator } from './operators/processSpecialAssignmentOperator.js';
import { processToken } from './processToken.js';

const binaryMap = new Map([
	['+=', '+'],
	['-=', '-'],
	['*=', '*'],
	['/=', '/']
]);

function isGoodVariableToken(token) {
	if (token.children.length === 0)
		return true;
	if (token.type === ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION)
		return true;
	return false;
}

function getVarToken(token) {
	while (!isGoodVariableToken(token))
		token = token.children[0];
	return token;
}

export function processAssignmentOperator(token, result, settings) {
	if (token.children.length === 0)
		return;
	if (processSpecialAssignmentOperator(token, result, settings))
		return;
	const varToken = getVarToken(token);
	processAssignmentPrefix(varToken, result, settings);
	if (token.children.length === 1) {
		result.append(' 0\n'); // just to recover from this erroneous situation.
	}
	else {
		const op = binaryMap.get(token.val);
		if (op !== undefined) {
			processReadExpression(varToken, result, settings);
			result.append(op + ' ');
		}
		processToken(token.children[1], result, settings);
		result.append('\n');
	}
};