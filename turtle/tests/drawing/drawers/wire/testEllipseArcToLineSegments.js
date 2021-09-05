import { EllipseArcShape } from '../../../../modules/drawing/vector/shapes/EllipseArcShape.js';
import { ellipseArcToLineSegments } from '../../../../modules/drawing/drawers/wire/ellipseArcToLineSegments.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testEllipseArcToLineSegments(logger) {
	const centre = new Vector3D(1, 2, 3);
	const arc = new EllipseArcShape(centre, 0, 100, 50, Math.PI, 0);
	const lines = ellipseArcToLineSegments(arc);
	if (!(lines instanceof Array))
		logger('lines expected to be an Array but got ' + lines);
	else if (lines.length < 3)
		logger(`There must be at least 3 line segments to represent an elliptical arc but got ${lines.length}`);

};