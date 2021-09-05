import { CallStackItem } from '../../../modules/debugging/debugger/CallStackItem.js';
import { ExecutingProcedure } from '../../../modules/parsing/execution/ExecutingProcedure.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { Procedure } from '../../../modules/parsing/Procedure.js';

export function testCallStackItem(logger) {
	const params = [];
	const procName = 'testProc';
	const nameToken = new ParseTreeToken(procName, null, 0, 0, ParseTreeTokenType.LEAF);
	const proc = new Procedure(procName, params, nameToken);
	const execProc = new ExecutingProcedure(proc, 0, 0, 0, 0);
	const item = new CallStackItem(execProc, 0);
	const e = item.getDiv();
	if (!(e instanceof Element))
		logger('Return value of getDiv() expected to be an Element but got this instead: ' + e);
	else if (e.textContent.toLowerCase().indexOf(procName.toLowerCase()) === -1)
		logger('Expected to find procedure name ' + procName + ' in text content but not found.  textContent = "' + e.textContent + '"');
};