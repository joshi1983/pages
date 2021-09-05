import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { testDebugger } from './debugger/testDebugger.js';
import { testFormatNumber } from './testFormatNumber.js';
import { testIntermediateCodeExplorer } from './intermediate-code-explorer/testIntermediateCodeExplorer.js';
import { testParseTreeTokenToElement } from './parse-tree-explorer/testParseTreeTokenToElement.js';

export function testDebugging(logger) {
	testDebugger(prefixWrapper('testDebugger', logger));
	testFormatNumber(prefixWrapper('testFormatNumber', logger));
	testIntermediateCodeExplorer(prefixWrapper('testIntermediateCodeExplorer', logger));
	testParseTreeTokenToElement(prefixWrapper('testParseTreeTokenToElement', logger));
};