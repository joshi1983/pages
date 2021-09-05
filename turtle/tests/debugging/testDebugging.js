import { testDebugger } from './debugger/testDebugger.js';
import { testFormatNumber } from './testFormatNumber.js';
import { testIntermediateCodeExplorer } from './intermediate-code-explorer/testIntermediateCodeExplorer.js';
import { testParseTreeTokenToElement } from './parse-tree-explorer/testParseTreeTokenToElement.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';

export function testDebugging(logger) {
	wrapAndCall([
		testDebugger,
		testFormatNumber,
		testIntermediateCodeExplorer,
		testParseTreeTokenToElement
	], logger);
};