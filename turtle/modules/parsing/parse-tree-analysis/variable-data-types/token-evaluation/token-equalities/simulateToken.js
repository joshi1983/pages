import { Command } from
'../../../../Command.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { simulateDoWhile } from
'./simulateDoWhile.js';
import { simulateFor } from
'./simulateFor.js';
import { simulateForever } from
'./simulateForever.js';
import { simulateIf } from
'./simulateIf.js';
import { simulateIfElse } from
'./simulateIfElse.js';
import { simulateRepeat } from
'./simulateRepeat.js';
import { simulateSwap } from
'./simulateSwap.js';
import { simulateUntil } from
'./simulateUntil.js';
import { simulateWhile } from
'./simulateWhile.js';

export const processors = new Map([
	['do.while', simulateDoWhile],
	['for', simulateFor],
	['forever', simulateForever],
	['if', simulateIf],
	['ifelse', simulateIfElse],
	['repeat', simulateRepeat],
	['swap', simulateSwap],
	['until', simulateUntil],
	['while', simulateWhile]
]);

export function simulateToken(token, result, executionState, procedureGlobalEffects) {
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined) {
			const processor = processors.get(info.primaryName);
			if (processor !== undefined)
				return processor(token, result, executionState, procedureGlobalEffects);
		}
	}
	
	return false;
};