import { compileBreak } from './compileBreak.js';
import { compileDequeue,
	asyncInit as compileDequeueAsyncInit } from './compileDequeue.js';
import { compileDoWhile,
	asyncInit as compileDoWhileAsyncInit } from './compileDoWhile.js';
import { compileFor,
	asyncInit as compileForAsyncInit } from './compileFor.js';
import { compileForever } from './compileForever.js';
import { compileIf,
	asyncInit as compileIfAsyncInit } from './compileIf.js';
import { compileIfElse,
	asyncInit as compileIfElseAsyncInit } from './compileIfElse.js';
import { compileIfElseExpression,
	asyncInit as compileIfElseExpressionAsyncInit } from './compileIfElseExpression.js';
import { compileInvoke,
	asyncInit as compileInvokeAsyncInit } from './compileInvoke.js';
import { compileOutput,
	asyncInit as compileOutputAsyncInit } from './compileOutput.js';
import { compilePush,
	asyncInit as compilePushAsyncInit } from './compilePush.js';
import { compileQueue,
	asyncInit as compileQueueAsyncInit } from './compileQueue.js';
import { compileRepeat,
	asyncInit as compileRepeatAsyncInit } from './compileRepeat.js';
import { compileStop } from './compileStop.js';
import { compileUntil,
	asyncInit as compileUntilAsyncInit } from './compileUntil.js';
import { compileWhile,
	asyncInit as compileWhileAsyncInit } from './compileWhile.js';
import { isIfElseExpressionToken } from '../parse-tree-analysis/isIfElseExpressionToken.js';

const asyncInits = [compileDequeueAsyncInit,
	compileDoWhileAsyncInit, compileForAsyncInit,
	compileIfAsyncInit, compileIfElseAsyncInit,
	compileInvokeAsyncInit, compileOutputAsyncInit,
	compilePushAsyncInit, compileQueueAsyncInit,
	compileRepeatAsyncInit, compileUntilAsyncInit,
	compileWhileAsyncInit
];

export async function asyncInit() {
	for (const asyncInit of asyncInits) {
		await asyncInit();
	}
};

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