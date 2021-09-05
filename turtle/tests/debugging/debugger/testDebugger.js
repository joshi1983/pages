import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testCallStackItem } from './testCallStackItem.js';
import { testCallStackItems } from './testCallStackItems.js';
import { testMakeCollapsible } from './testMakeCollapsible.js';
import { testRepcountStackItem } from './testRepcountStackItem.js';
import { testRepcountStackItems } from './testRepcountStackItems.js';
import { testVariable } from './testVariable.js';
import { testVariables } from './testVariables.js';

export function testDebugger(logger) {
	testCallStackItem(prefixWrapper('testCallStackItem', logger));
	testCallStackItems(prefixWrapper('testCallStackItems', logger));
	testMakeCollapsible(prefixWrapper('testMakeCollapsible', logger));
	testRepcountStackItem(prefixWrapper('testRepcountStackItem', logger));
	testRepcountStackItems(prefixWrapper('testRepcountStackItems', logger));
	testVariable(prefixWrapper('testVariable', logger));
	testVariables(prefixWrapper('testVariables', logger));
};