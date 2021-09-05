import { testAbsoluteUrl } from './testAbsoluteUrl.js';
import { testDataTypes } from './testDataTypes.js';
import { testLineCap } from './testLineCap.js';
import { testStepPosition } from './testStepPosition.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testStringFormats(logger) {
	wrapAndCall([
		testAbsoluteUrl,
		testDataTypes,
		testLineCap,
		testStepPosition,
	], logger);
};