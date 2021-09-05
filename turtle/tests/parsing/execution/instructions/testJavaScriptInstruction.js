import { Colour } from '../../../../modules/Colour.js';
import { createRootToken } from '../../../helpers/createRootToken.js';
import { JavaScriptInstruction } from '../../../../modules/parsing/execution/instructions/JavaScriptInstruction.js';
import { Transparent } from '../../../../modules/Transparent.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

const rootToken = createRootToken();

function testConvert(logger) {
	const result = JavaScriptInstruction.convertListToString(["Hello", "World"]);
	const expected = "Hello World";
	if (result !== expected)
		logger(`Expected "${expected}" but got "{$result}"`);
}

function testDTO(logger) {
	const dto = {
		'code': ''
	};
	const instruction = JavaScriptInstruction.createFromDTO(dto, rootToken);
	const newDTO = instruction.toDTO();
	if (newDTO.code !== '')
		logger(`Expected code to be '' but found ${newDTO.code}`);
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
	wrapAndCall([
		testConvert,
		testDTO,
		testJavaScriptInstructionAccessingFunction,
		testJavaScriptInstructionPushValueToStack,
		testTransparent
	], logger);
};
