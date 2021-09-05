import { testForLoops } from './for-loops/testForLoops.js';
import { testIf } from './if/testIf.js';
import { testSwitch } from './switch/testSwitch.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTypeProcessors(logger) {
	wrapAndCall([
		testForLoops,
		testIf,
		testSwitch
	], logger);
};