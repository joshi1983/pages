import { compileDequeue } from './compileDequeue.js';
import { compileDoWhile } from './compileDoWhile.js';
import { compileFor } from './compileFor.js';
import { compileForever } from './compileForever.js';
import { compileIf } from './compileIf.js';
import { compileIfElse } from './compileIfElse.js';
import { compileInvoke } from './compileInvoke.js';
import { compileOutput } from './compileOutput.js';
import { compilePush } from './compilePush.js';
import { compileQueue } from './compileQueue.js';
import { compileRepeat } from './compileRepeat.js';
import { compileStop } from './compileStop.js';
import { compileUntil } from './compileUntil.js';
import { compileWhile } from './compileWhile.js';

export function addInstructionsForSpecialCommand(token, commandInfo, procedures, result, logger) {
	if (typeof commandInfo !== 'object')
		return false;
	if (commandInfo.primaryName === 'dequeue') {
		compileDequeue(token.children, procedures, result, logger);
	}
	else if (commandInfo.primaryName === 'do.while') {
		compileDoWhile(token.children, procedures, result, logger);
	}
	else if (commandInfo.primaryName === 'for') {
		compileFor(token.children, procedures, result, logger);
	}
	else if (commandInfo.primaryName === 'forever') {
		compileForever(token.children, procedures, result, logger);
	}
	else if (commandInfo.primaryName === 'if') {
		compileIf(token.children, procedures, result, logger);
	}
	else if (commandInfo.primaryName === 'ifelse') {
		compileIfElse(token.children, procedures, result, logger);
	}
	else if (commandInfo.primaryName === 'invoke') {
		compileInvoke(token.children, procedures, result, logger);
	}
	else if (commandInfo.primaryName === 'output') {
		compileOutput(token.children, procedures, result, logger);
	}
	else if (commandInfo.primaryName === 'push') {
		compilePush(token.children, procedures, result, logger);
	}
	else if (commandInfo.primaryName === 'queue') {
		compileQueue(token.children, procedures, result, logger);
	}
	else if (commandInfo.primaryName === 'repeat') {
		compileRepeat(token.children, procedures, result, logger);
	}
	else if (commandInfo.primaryName === 'stop') {
		compileStop(token, result);
	}
	else if (commandInfo.primaryName === 'until') {
		compileUntil(token.children, procedures, result, logger);
	}
	else if (commandInfo.primaryName === 'while') {
		compileWhile(token.children, procedures, result, logger);
	}
	else
		return false;

	return true;
};