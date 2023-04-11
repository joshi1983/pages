import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testBreakpoint } from './testBreakpoint.js';
import { testErrorCasesValidationAtRuntime } from './testErrorCasesValidationAtRuntime.js';
import { testExecuteLogoProcedure } from './testExecuteLogoProcedure.js';
import { testInstructions } from './instructions/testInstructions.js';
import { testLogoProgramExecuter } from './testLogoProgramExecuter.js';
import { testLogoProgramExecuterAsync } from './testLogoProgramExecuterAsync.js';
import { testLogoProgramExecuterBreakpoints } from './testLogoProgramExecuterBreakpoints.js';
import { testLogoProgramExecuterInvokeUsingPrint } from './testLogoProgramExecuterInvokeUsingPrint.js';
import { testLogoProgramExecuterUsingPrint } from './testLogoProgramExecuterUsingPrint.js';
import { testLogoProgramExecuterWithBreakCommand } from './testLogoProgramExecuterWithBreakCommand.js';
import { testLogoProgramExecuterWithGradients } from './testLogoProgramExecuterWithGradients.js';

export function testExecution(logger) {
	testBreakpoint(prefixWrapper('testBreakpoint', logger));
	testErrorCasesValidationAtRuntime(prefixWrapper('testErrorCasesValidationAtRuntime', logger));
	testExecuteLogoProcedure(prefixWrapper('testExecuteLogoProcedure', logger));
	testInstructions(prefixWrapper('testInstructions', logger));
	testLogoProgramExecuter(prefixWrapper('testLogoProgramExecuter', logger));
	testLogoProgramExecuterBreakpoints(prefixWrapper('testLogoProgramExecuterBreakpoints', logger));
	testLogoProgramExecuterInvokeUsingPrint(prefixWrapper('testLogoProgramExecuterInvokeUsingPrint', logger));
	testLogoProgramExecuterUsingPrint(prefixWrapper('testLogoProgramExecuterUsingPrint', logger));
	testLogoProgramExecuterWithBreakCommand(prefixWrapper('testLogoProgramExecuterWithBreakCommand', logger));
	testLogoProgramExecuterWithGradients(prefixWrapper('testLogoProgramExecuterWithGradients', logger));
};