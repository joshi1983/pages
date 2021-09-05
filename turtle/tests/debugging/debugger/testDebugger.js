import { testCallStackItem } from './testCallStackItem.js';
import { testCallStackItems } from './testCallStackItems.js';
import { testMakeCollapsible } from './testMakeCollapsible.js';
import { testRepcountStackItem } from './testRepcountStackItem.js';
import { testRepcountStackItems } from './testRepcountStackItems.js';
import { testVariable } from './testVariable.js';
import { testVariables } from './testVariables.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testDebugger(logger) {
	wrapAndCall([
		testCallStackItem,
		testCallStackItems,
		testMakeCollapsible,
		testRepcountStackItem,
		testRepcountStackItems,
		testVariable,
		testVariables
	], logger);
};