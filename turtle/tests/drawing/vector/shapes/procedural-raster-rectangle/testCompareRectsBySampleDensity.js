import { compareRectsBySampleDensity } from '../../../../../modules/drawing/vector/shapes/procedural-raster-rectangle/compareRectsBySampleDensity.js';
import { Rect } from '../../../../../modules/drawing/vector/shapes/procedural-raster-rectangle/Rect.js';

export function testCompareRectsBySampleDensity(logger) {
	const rect1 = new Rect(0, 0, 5, 5, 1, 1);
	const rect2 = new Rect(0, 0, 5, 5, 0.5, 0.5);
	const result = compareRectsBySampleDensity(rect1, rect2);
	if (result >= 0)
		logger(`Expected a negative value but got ${result}`);
	
	let a = [rect1, rect2];
	a.sort(compareRectsBySampleDensity);
	if (a[0] !== rect1)
		logger(`Expected a different order from sorting by compareRectsBySampleDensity`);

	a = [rect2, rect1];
	a.sort(compareRectsBySampleDensity);
	if (a[0] !== rect1)
		logger(`After second sort, expected a different order from sorting by compareRectsBySampleDensity`);
};