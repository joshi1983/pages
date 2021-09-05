import { noop } from '../../../../noop.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processBinaryOperator } from './processBinaryOperator.js';
import { processCommand } from './processCommand.js';
import { processGo } from './processGo.js';
import { processIf } from './processIf.js';
import { processInputReference } from './processInputReference.js';
import { processLet } from './processLet.js';
import { processNumberLiteral } from './processNumberLiteral.js';
import { processProcStart } from './processProcStart.js';
import { processRepeat } from './processRepeat.js';
import { processStringLiteral } from './processStringLiteral.js';
import { processVariableReference } from './processVariableReference.js';

const typeProcessors = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.COMMAND, processCommand],
	[ParseTreeTokenType.END, noop],
	[ParseTreeTokenType.GO, processGo],
	[ParseTreeTokenType.IF, processIf],
	[ParseTreeTokenType.INPUT_REFERENCE, processInputReference],
	[ParseTreeTokenType.LET, processLet],
	[ParseTreeTokenType.NUMBER_LITERAL, processNumberLiteral],
	[ParseTreeTokenType.PROC_START, processProcStart],
	[ParseTreeTokenType.REPEAT, processRepeat],
	[ParseTreeTokenType.RETURN, processCommand],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral],
	[ParseTreeTokenType.VARIABLE_REFERENCE, processVariableReference],
]);

export function processToken(token, buffer, settings) {
	const processor = typeProcessors.get(token.type);
	if (processor !== undefined)
		processor(token, buffer, settings);
	else {
		if (token.val !== null)
			buffer.append(token.val + ' ');
		const children = token.children;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			processToken(child, buffer, settings);
		}
	}
};