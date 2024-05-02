import { testArc } from './testArc.js';
import { testLineSegment } from './testLineSegment.js';
import { testOrientedArc } from './testOrientedArc.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testShapeConversion(logger) {
	wrapAndCall([
		testArc,
		testLineSegment,
		testOrientedArc
	], logger);
};