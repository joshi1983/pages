import { testLineSegment } from './testLineSegment.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testShapeConversion(logger) {
	wrapAndCall([
		testLineSegment
	], logger);
};