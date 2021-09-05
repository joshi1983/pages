import { getTestExecuterForCode } from '../../helpers/getTestExecuterForCode.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

function testContinuousExecution(logger) {
	/*
	The immediate checks here work because the continuous execution won't execute a sequence of instructions until an interval is reached.
	The following test steps are synchronous so there is no way the executer will execute any of the given code and halt.
	*/
	const executer = getTestExecuterForCode('print 5', logger);
	if (executer.isPaused() !== true)
		logger('executer should initially be paused but got ' + executer.isPaused());
	executer.startContinuousExecution();
	if (executer.isPaused() !== false)
		logger('executer should not be paused immediately fter calling startContinuousExecution() but got ' + executer.isPaused());
	executer.pauseContinuousExecution();
	if (executer.isPaused() !== true)
		logger('executer should be paused immediately after calling pauseContinuousExecution() but got ' + executer.isPaused());
}

function testNoCode(logger) {
	const executer = getTestExecuterForCode('', logger);
	executer.executeInstruction();
	if (!executer.isHalted) {
		logger('Executer should be halted after trying to execute an instruction beyond its end');
	}
}

function testShortCode(logger) {
	const executer = getTestExecuterForCode('fd 100', logger);
	executer.executeInstruction(); // should have executed a 'push 100'.
	if (executer.executionContext.instructionIndex !== 1)
		logger('instructionIndex expected to be 1 after executing 1 instruction but got ' + executer.executionContext.instructionIndex);
	if (executer.executionContext.valueStack.length !== 1)
		logger('valueStack height expected to be 1 but got ' + executer.executionContext.valueStack.length);
	if (executer.executionContext.valueStack[0] !== 100)
		logger('valueStack[0] expected to be 100 but got ' + executer.executionContext.valueStack[0]);
	executer.executeInstruction(); // should be executing the 'forward' command.
	if (executer.executionContext.instructionIndex !== 2)
		logger('instructionIndex expected to be 2 but got ' + executer.executionContext.instructionIndex);
	if (executer.executionContext.valueStack.length !== 1)
		logger('After running forward command instruction, expected to have valueStack.length of 1 but got ' + executer.executionContext.valueStack.length);
	executer.executeInstruction(); // should be executing the pop instruction.
	if (executer.executionContext.valueStack.length !== 0)
		logger('After pop instruction, expected to have valueStack.length of 0 but got ' + executer.executionContext.valueStack.length);
}

export function testLogoProgramExecuter(logger) {
	testContinuousExecution(prefixWrapper('testContinuousExecution', logger));
	testNoCode(prefixWrapper('testNoCode', logger));
	testShortCode(prefixWrapper('testShortCode', logger));
}