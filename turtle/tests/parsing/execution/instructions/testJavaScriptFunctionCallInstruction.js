import { compile } from '../../../../modules/parsing/compile.js';
import { createRootToken } from '../../../helpers/createRootToken.js';
import { createTestTurtle } from '../../../helpers/createTestTurtle.js';
import { ExecutionContext } from '../../../../modules/parsing/execution/ExecutionContext.js';
import { JavaScriptFunctionCallInstruction } from '../../../../modules/parsing/execution/instructions/JavaScriptFunctionCallInstruction.js';
import { TestParseLogger } from '../../../helpers/TestParseLogger.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function getTestInfo(logger) {
	const turtle = createTestTurtle();
	const code = '';
	const parseLogger = new TestParseLogger(logger, code);
	const procedures = new Map();
	const initialVariables = new Map();
	const compileOptions = {
		'translateToJavaScript': true
	};
	const treeRoot = createRootToken();
	const program = compile(code, treeRoot, parseLogger, procedures, compileOptions, initialVariables);
	const context = new ExecutionContext(turtle, program);
	return {
		'context': context
	};
}

function testWithNoArgs(logger) {
	let isCalled = false;
	function testFunction() {
		isCalled = true;
	}
	const treeRoot = createRootToken();
	const instruction = new JavaScriptFunctionCallInstruction(testFunction, 0, false, treeRoot);
	const testInfo = getTestInfo(logger);
	instruction.execute(testInfo.context);
}

function testWithOneArg(logger) {
	let isCalled = false;
	function testFunction(n) {
		isCalled = true;
		return n * 2;
	}
	const treeRoot = createRootToken();
	const instruction = new JavaScriptFunctionCallInstruction(testFunction, 1, true, treeRoot);
	const testInfo = getTestInfo(logger);
	const context = testInfo.context;
	context.valueStack.push(3);
	instruction.execute(testInfo.context);
	const returnValue = context.valueStack[context.valueStack.length - 1];
	if (returnValue !== 6)
		logger();
}

export function testJavaScriptFunctionCallInstruction(logger) {
	wrapAndCall([
		testWithNoArgs,
		testWithOneArg
	], logger);
};