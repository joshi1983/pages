import { testForLoops } from './for-loops/testForLoops.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testTypeProcessors(logger) {
	wrapAndCall([
		testForLoops
	], logger);
};