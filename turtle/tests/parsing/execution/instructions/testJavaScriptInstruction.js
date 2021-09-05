import { Colour } from '../../../../modules/Colour.js';
import { createRootToken } from '../../../helpers/createRootToken.js';
import { JavaScriptInstruction } from '../../../../modules/parsing/execution/instructions/JavaScriptInstruction.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { Transparent } from '../../../../modules/Transparent.js';

const rootToken = createRootToken();

function testConvert(logger) {
	const result = JavaScriptInstruction.convertListToString(["Hello", "World"]);
	const expected = "Hello World";
	if (result !== expected)
		logger(`Expected "${expected}" but got "{$result}"`);
}

function testJavaScriptInstructionAccessingFunction(logger) {
	const instruction = new JavaScriptInstruction('return this.convertToColour(5)', rootToken);
	const result = instruction.execute();
	if (!(result instanceof Colour))
		logger('Expected an instance of Colour but got ' + result);
}

function testJavaScriptInstructionPushValueToStack(logger) {
	const instruction = new JavaScriptInstruction('context.valueStack.push(4)', rootToken);
	const context = {
		'valueStack': []
	};
	instruction.execute(context);
	if (context.valueStack.length !== 1)
		logger('Expected valueStack.length to be 1 but got ' + context.valueStack.length);
}

function testTransparent(logger) {
	const instruction = new JavaScriptInstruction('return this.Transparent', rootToken);
	const result = instruction.execute({});
	if (result != Transparent)
		logger('Expected to get Transparent but got: ' + result);
};

export function testJavaScriptInstruction(logger) {
	testConvert(prefixWrapper('testConvert', logger));
	testJavaScriptInstructionAccessingFunction(prefixWrapper('testJavaScriptInstructionAccessingFunction', logger));
	testJavaScriptInstructionPushValueToStack(prefixWrapper('testJavaScriptInstructionPushValueToStack', logger));
	testTransparent(prefixWrapper('testTransparent', logger));
};
