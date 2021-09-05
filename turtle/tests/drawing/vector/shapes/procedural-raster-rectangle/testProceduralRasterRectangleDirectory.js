import { testCompareRectsBySampleDensity } from './testCompareRectsBySampleDensity.js';
import { testGetRectIntersection } from './testGetRectIntersection.js';
import { testRect } from './testRect.js';
import { testRectRenderer } from './testRectRenderer.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testProceduralRasterRectangleDirectory(logger) {
	wrapAndCall([
		testCompareRectsBySampleDensity,
		testGetRectIntersection,
		testRect,
		testRectRenderer
	], logger);
};