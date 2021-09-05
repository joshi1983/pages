import { testLineCap } from './testLineCap.js';
import { testShapeStyle } from './testShapeStyle.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testStyle(logger) {
	wrapAndCall([
		testLineCap,
		testShapeStyle
	], logger);
};