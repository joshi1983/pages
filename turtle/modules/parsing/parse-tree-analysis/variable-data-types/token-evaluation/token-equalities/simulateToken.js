import { Command } from
'../../../../Command.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { simulateFor } from
'./simulateFor.js';
import { simulateRepeat } from
'./simulateRepeat.js';
import { simulateSwap } from
'./simulateSwap.js';
import { simulateWhile } from
'./simulateWhile.js';

const processors = new Map([
	['for', simulateFor],
	['repeat', simulateRepeat],
	['swap', simulateSwap],
	['while', simulateWhile]
]);

export function simulateToken(token, result, executionState) {
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		const processor = processors.get(info.primaryName);
		if (processor !== undefined)
			return processor(token, result, executionState);
	}
	
	return false;
};