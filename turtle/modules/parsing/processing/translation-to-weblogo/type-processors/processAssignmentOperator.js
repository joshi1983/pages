import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processSpecialAssignmentOperator } from './operators/processSpecialAssignmentOperator.js';
import { processToken } from './processToken.js';
import { shouldUseLocalmake } from './operators/shouldUseLocalmake.js';

const binaryMap = new Map([
	['+=', '+'],
	['-=', '-'],
	['*=', '*'],
	['/=', '/']
]);

export function processAssignmentOperator(token, result, settings) {
	if (token.children.length === 0 ||
	token.children[0].type !== ParseTreeTokenType.IDENTIFIER)
		return;
	if (processSpecialAssignmentOperator(token, result, settings))
		return;
	const varToken = token.children[0];
	if (shouldUseLocalmake(token))
		result.append('local');
	const varName = varToken.val;
	result.append(`make "${varName} `);
	if (token.children.length === 1) {
		result.append('0'); // just to recover from this erroneous situation.
	}
	else {
		const op = binaryMap.get(token.val);
		if (op !== undefined)
			result.append(`:${varName} ${op} `);
		processToken(token.children[1], result, settings);
	}
};