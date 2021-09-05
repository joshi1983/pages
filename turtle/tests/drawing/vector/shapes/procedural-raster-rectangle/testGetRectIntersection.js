import { getRectIntersection } from
'../../../../../modules/drawing/vector/shapes/procedural-raster-rectangle/getRectIntersection.js';
import { SimpleRect2D } from
'../../../../../modules/drawing/vector/shapes/procedural-raster-rectangle/SimpleRect2D.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testGetRectIntersection(logger) {
	const cases = [
	{'inArgs': [
		new SimpleRect2D(0, 0, 1, 1, 0),
		new SimpleRect2D(2, 0, 1, 1, 0)
	], 'out': undefined},
	{'inArgs': [
		new SimpleRect2D(0, 0, 1, 1, 0),
		new SimpleRect2D(2, 0, 1, 1, Math.PI)
	], 'out': undefined},
	{'inArgs': [
		new SimpleRect2D(0, 0, 1, 1, 0),
		new SimpleRect2D(3, 0, 1, 1, Math.PI)
	], 'out': undefined}
	];
	testInOutPairs(cases, getRectIntersection, logger);
};