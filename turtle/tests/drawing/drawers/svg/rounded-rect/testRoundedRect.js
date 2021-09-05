import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { testIsRoundedRect } from './testIsRoundedRect.js';
import { testReverseElements } from './testReverseElements.js';
import { testGetTransformInfo } from './testGetTransformInfo.js';

export function testRoundedRect(logger) {
	testIsRoundedRect(prefixWrapper('testIsRoundedRect', logger));
	testReverseElements(prefixWrapper('testReverseElements', logger));
	testGetTransformInfo(prefixWrapper('testGetTransformInfo', logger));
};