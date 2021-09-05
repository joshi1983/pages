import { testForLoops } from './for-loops/testForLoops.js';
import { testHelpers } from './helpers/testHelpers.js';
import { testSwitch } from './switch/testSwitch.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTypeProcessors(logger) {
	wrapAndCall([
		testForLoops,
		testHelpers,
		testSwitch
	], logger);
};