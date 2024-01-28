import { addLineHints } from './addLineHints.js';
import { addNailMarker } from './addNailMarker.js';
import { BoundingBox2D } from '../../../drawing/vector/BoundingBox2D.js';
import { clamp } from '../../../clamp.js';
import { getDistinctPointsFromDrawing } from './getDistinctPointsFromDrawing.js';
import { sanitizeOptions } from './sanitizeOptions.js';
import { sanitizePointsCloserThanThreshold } from './sanitizePointsCloserThanThreshold.js';
import { Vector2DDrawing } from '../../../drawing/vector/Vector2DDrawing.js';

export function drawingToStringArtKitDrawing(drawing, options) {
	if (typeof drawing !== 'object')
		throw new Error('drawing must be an object.  Not: ' + drawing);
	options = sanitizeOptions(options);
	let points = getDistinctPointsFromDrawing(drawing);
	const boundingBox = new BoundingBox2D([points]);
	const minSeparation = boundingBox.getAverageDimension() * 0.001;
	points = sanitizePointsCloserThanThreshold(points, minSeparation);

	/* try to let the points be larger if there are fewer of them 
	but only within a reasonable range.
	*/
	const radiusSizeRatio = clamp(1 / points.length, 0.0015, 0.03);
	const radius = boundingBox.getAverageDimension() * radiusSizeRatio;
	const shapes = [];

	// add circles for every point.
	for (let i = 0; i < points.length; i++) {
		const point = points[i];
		addNailMarker(point, radius, shapes);
	}
	if (options.lineHints === true) {
		addLineHints(drawing, points, radius, shapes);
	}
	const result = new Vector2DDrawing();
	result.setDimensions(drawing.width, drawing.height);
	result.addForegroundShapes(shapes);

	return result;
};