import { BoundingBox } from
'../../../../modules/drawing/vector/BoundingBox.js';
import { EllipseArcShape } from
'../../../../modules/drawing/vector/shapes/EllipseArcShape.js';
import { equalWithinThreshold } from '../../../../modules/equalWithinThreshold.js';
import { Orientation3D } from
'../../../../modules/drawing/vector/Orientation3D.js';
import { OrientedArcShape } from
'../../../../modules/drawing/vector/shapes/OrientedArcShape.js';
import { Vector3D } from
'../../../../modules/drawing/vector/Vector3D.js';

export function testOrientedArcShape(logger) {
	const orientation = new Orientation3D();
	const orientedArcShape = new OrientedArcShape(new Vector3D(), orientation, 100, Math.PI / 4);
	const boxResult = orientedArcShape.getBoundingBox();
	if (!(boxResult instanceof BoundingBox))
		logger(`Expected getBoundingBox() to return a BoundingBox but found ${boxResult}`);
	const isVisibleResult = orientedArcShape.isVisible();
	if (isVisibleResult !== true)
		logger(`Expected isVisible() to return true but found ${isVisibleResult}`);
	const projection = orientedArcShape.getZProjectionShape();
	if (!(projection instanceof EllipseArcShape)) {
		logger(`Expected getZProjectionShape() to return an EllipseArcShape but found ${projection}`);
	}
	const startPoint = orientedArcShape.getStartPoint();
	if (!(startPoint instanceof Vector3D)) {
		logger(`Expected startPoint to be a Vector3D but found ${startPoint}`);
	}
	else {
		const distanceFromPosition = startPoint.magnitude();
		if (!equalWithinThreshold(distanceFromPosition, 100, 0.00001))
			logger(`For startPoint, expected distanceFromPosition to be 100(the radius) but got ${distanceFromPosition}`);
	}
	const endPoint = orientedArcShape.getEndPoint();
	if (!(endPoint instanceof Vector3D)) {
		logger(`Expected endPoint to be a Vector3D but found ${endPoint}`);
	}
	else {
		const distanceFromPosition = endPoint.magnitude();
		if (!equalWithinThreshold(distanceFromPosition, 100, 0.00001))
			logger(`For endPoint, expected distanceFromPosition to be 100(the radius) but got ${distanceFromPosition}`);
	}
};