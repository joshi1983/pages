import { compileBreak } from './compileBreak.js';
import { compileDequeue } from './compileDequeue.js';
import { compileDoWhile } from './compileDoWhile.js';
import { compileFor } from './compileFor.js';
import { compileForever } from './compileForever.js';
import { compileIf } from './compileIf.js';
import { compileIfElse } from './compileIfElse.js';
import { compileIfElseExpression } from './compileIfElseExpression.js';
import { compileInvoke } from './compileInvoke.js';
import { compileOutput } from './compileOutput.js';
import { compilePush } from './compilePush.js';
import { compileQueue } from './compileQueue.js';
import { compileRepeat } from './compileRepeat.js';
import { compileStop } from './compileStop.js';
import { compileUntil } from './compileUntil.js';
import { compileWhile } from './compileWhile.js';
import { isIfElseExpressionToken } from '../parse-tree-analysis/isIfElseExpressionToken.js';

const compileChildrenFunctions = new Map([
	['dequeue', compileDequeue],
	['do.while', compileDoWhile],
	['for', compileFor],
	['forever', compileForever],
	['if', compileIf],
	['invoke', compileInvoke],
	['output', compileOutput],
	['push', compilePush],
	['queue', compileQueue],
	['repeat', compileRepeat],
	['until', compileUntil],
	['while', compileWhile]
]);

export function addInstructionsForSpecialCommand(token, commandInfo, procedures, result, logger) {
	if (typeof commandInfo !== 'object')
		return false;
	const compileChildrenFunction = compileChildrenFunctions.get(commandInfo.primaryName);
	if (compileChildrenFunction !== undefined)
		compileChildrenFunction(token.children, procedures, result, logger);
	else if (commandInfo.primaryName === 'break') {
		compileBreak(token, result);
	}
	else if (commandInfo.primaryName === 'ifelse') {
		if (isIfElseExpressionToken(token))
			compileIfElseExpression(token.children, procedures, result, logger);
		else
			compileIfElse(token.children, procedures, result, logger);
	}
	else if (commandInfo.primaryName === 'stop') {
		compileStop(token, result);
	}
	else
		return false;

	return true;
};