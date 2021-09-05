import { ArcShape } from '../../../../modules/drawing/vector/shapes/ArcShape.js';
import { arcToLineSegments } from '../../../../modules/drawing/drawers/wire/arcToLineSegments.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testArcToLineSegments(logger) {
	const centre = new Vector3D(1, 2, 3);
	const arc = new ArcShape(centre, 0, 100, Math.PI);
	const lines = arcToLineSegments(arc);
	if (!(lines instanceof Array))
		logger('lines expected to be an Array but got ' + lines);
	else if (lines.length < 2)
		logger(`There must be at least 2 line segments to represent an arc but got ${lines.length}`);
};