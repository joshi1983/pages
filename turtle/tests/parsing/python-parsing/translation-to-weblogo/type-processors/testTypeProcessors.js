import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { testForLoops } from './for-loops/testForLoops.js';

export function testTypeProcessors(logger) {
	testForLoops(prefixWrapper('testForLoops', logger));
};