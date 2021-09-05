import { Colour } from '../../../../modules/Colour.js';
import { ColouredLineSegment } from
'../../../../modules/drawing-menu/download/line-segments/ColouredLineSegment.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testColouredLineSegment(logger) {
	const lineSegment = new ColouredLineSegment(
		new Vector3D(0, 100, 200),
		new Vector3D(50, 150, 300),
		new Colour(0, 0, 0));
	if (!(lineSegment.midPoint instanceof Vector3D))
		logger(`Expected midPoint to be a Vector3D but got ${lineSegment.midPoint}`);
	else {
		const m = lineSegment.midPoint;
		if (m.getX() !== 25)
			logger(`Expected midPoint.getX() to be 25 but got ${m.getX()}`);
		if (m.getY() !== 125)
			logger(`Expected midPoint.getY() to be 125 but got ${m.getY()}`);
		if (m.getZ() !== 250)
			logger(`Expected midPoint.getZ() to be 250 but got ${m.getZ()}`);
	}
};