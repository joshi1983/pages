import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testAbsoluteUrl } from './testAbsoluteUrl.js';
import { testLineCap } from './testLineCap.js';
import { testStepPosition } from './testStepPosition.js';

export function testStringFormats(logger) {
	testAbsoluteUrl(prefixWrapper('testAbsoluteUrl', logger));
	testLineCap(prefixWrapper('testLineCap', logger));
	testStepPosition(prefixWrapper('testStepPosition', logger));
};