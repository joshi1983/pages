import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { testLineCap } from './testLineCap.js';
import { testShapeStyle } from './testShapeStyle.js';

export function testStyle(logger) {
	testLineCap(prefixWrapper('testLineCap', logger));
	testShapeStyle(prefixWrapper('testShapeStyle', logger));
};