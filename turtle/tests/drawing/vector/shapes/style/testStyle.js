import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { testShapeStyle } from './testShapeStyle.js';

export function testStyle(logger) {
	testShapeStyle(prefixWrapper('testShapeStyle', logger));
};