import { getTestExecuterForCode } from './getTestExecuterForCode.js';

const compileOptions = {
	'translateToJavaScript': true,
	'mergeJavaScriptInstructions': true,
	'forProduction': true
};

export function createDrawingFromCode(code, logger) {
	if (typeof code !== 'string')
		throw new Error(`code must be a string but got ${code}`);
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function but got ${logger}`);
	const executer = getTestExecuterForCode(code, logger, compileOptions);
	executer.executeInstructionsSync(1000);
	return executer.turtle.drawing;
};