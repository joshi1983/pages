import { testAbsoluteUrl } from './testAbsoluteUrl.js';
import { testDataTypes } from './testDataTypes.js';
import { testFontWeight } from './testFontWeight.js';
import { testLineCap } from './testLineCap.js';
import { testNumeric } from './testNumeric.js';
import { testStepPosition } from './testStepPosition.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testStringFormats(logger) {
	wrapAndCall([
		testAbsoluteUrl,
		testDataTypes,
		testFontWeight,
		testLineCap,
		testNumeric,
		testStepPosition,
	], logger);
};