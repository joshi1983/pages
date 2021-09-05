import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testAbsoluteUrl } from './testAbsoluteUrl.js';
import { testStepPosition } from './testStepPosition.js';

export function testStringFormats(logger) {
	testAbsoluteUrl(prefixWrapper('testAbsoluteUrl', logger));
	testStepPosition(prefixWrapper('testStepPosition', logger));
};