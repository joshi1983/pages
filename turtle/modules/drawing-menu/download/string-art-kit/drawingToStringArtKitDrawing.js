import { BoundingBox2D } from '../../../drawing/vector/BoundingBox2D.js';
import { CircleShape } from '../../../drawing/vector/shapes/CircleShape.js';
import { clamp } from '../../../clamp.js';
import { Colour } from '../../../Colour.js';
import { getDistinctPointsFromDrawing } from './getDistinctPointsFromDrawing.js';
import { LineSegmentShape } from '../../../drawing/vector/shapes/LineSegmentShape.js';
import { sanitizePointsCloserThanThreshold } from './sanitizePointsCloserThanThreshold.js';
import { ShapeStyle } from '../../../drawing/vector/shapes/style/ShapeStyle.js';
import { Vector2DDrawing } from '../../../drawing/vector/Vector2DDrawing.js';
import { Vector3D } from '../../../drawing/vector/Vector3D.js';

function addNailMarker(v2d, radius, shapes) {
	const circleStyle = new ShapeStyle({
		'pen': {
			'width': radius * 0.05,
			'color': new Colour('#000')
		}
	});
	const lineStyle = new ShapeStyle({
		'pen': {
			'width': radius * 0.1,
			'color': new Colour('#000')
		}
	});
	const v3D = new Vector3D(v2d.getX(), v2d.getY(), 0);
	shapes.push(new CircleShape(v3D, radius, circleStyle.deepClone()));
	const halfPi = Math.PI * 0.5;
	for (let angle = 0; angle <= halfPi; angle += halfPi) {
		const line = new LineSegmentShape(v3D.getDisplacedByPolar(angle, radius), v3D.getDisplacedByPolar(angle + Math.PI, radius), lineStyle);
		shapes.push(line);
	}
}

export function drawingToStringArtKitDrawing(drawing) {
	let points = getDistinctPointsFromDrawing(drawing);
	const boundingBox = new BoundingBox2D([points]);
	const minSeparation = boundingBox.getAverageDimension() * 0.005;
	points = sanitizePointsCloserThanThreshold(points, minSeparation);

	/* try to let the points be larger if there are fewer of them 
	but only within a reasonable range.
	*/
	const radiusSizeRatio = clamp(1 / points.length, 0.008, 0.03);
	const radius = boundingBox.getAverageDimension() * radiusSizeRatio;
	const shapes = [];

	// add circles for every point.
	for (let i = 0; i < points.length; i++) {
		const point = points[i];
		addNailMarker(point, radius, shapes);
	}
	const result = new Vector2DDrawing();
	result.setDimensions(drawing.width, drawing.height);
	result.addForegroundShapes(shapes);

	return result;
};