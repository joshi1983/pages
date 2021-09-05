import { testIsRoundedRect } from './testIsRoundedRect.js';
import { testReverseElements } from './testReverseElements.js';
import { testGetTransformInfo } from './testGetTransformInfo.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testRoundedRect(logger) {
	wrapAndCall([
		testIsRoundedRect,
		testReverseElements,
		testGetTransformInfo
	], logger);
};