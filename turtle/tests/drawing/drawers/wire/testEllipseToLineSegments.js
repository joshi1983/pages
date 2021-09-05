import { EllipseShape } from '../../../../modules/drawing/vector/shapes/EllipseShape.js';
import { ellipseToLineSegments } from '../../../../modules/drawing/drawers/wire/ellipseToLineSegments.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testEllipseToLineSegments(logger) {
	const centre = new Vector3D(1, 2, 3);
	const ellipse = new EllipseShape(centre, 0, 100, 50);
	const lines = ellipseToLineSegments(ellipse);
	if (!(lines instanceof Array))
		logger('lines expected to be an Array but got ' + lines);
	else if (lines.length < 4)
		logger(`There must be at least 4 line segments to represent a ellipse but got ${lines.length}`);
};