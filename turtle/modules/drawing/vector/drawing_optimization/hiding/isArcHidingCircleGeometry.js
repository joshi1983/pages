import { LineCap } from
'../../shapes/style/LineCap.js';
import { Vector2D } from
'../../Vector2D.js';

export function isArcHidingCircleGeometry(arcShape, circleCenterCoords, radius) {
	if (typeof arcShape !== 'object')
		throw new Error(`arcShape must be an object but found ${arcShape}`);
	if (!(circleCenterCoords instanceof Array))
		throw new Error(`circleCenterCoords must be an Array but found ${circleCenterCoords}`);
	if (typeof radius !== 'number')
		throw new Error(`radius must be a number but found ${radius}`);
	
	const penWidth = arcShape.style.getPenWidth();
	if (penWidth === 0)
		return false;

	if (circleCenterCoords.length === 2)
		circleCenterCoords[2] = arcShape.position.coords[2];

	const d = Vector2D.distance(arcShape.position.coords, circleCenterCoords);
	if (d - radius < arcShape.radius - penWidth / 2)
		return false;
	if (d + radius > arcShape.radius + penWidth / 2)
		return false;
	
	const delta = [circleCenterCoords[0] - arcShape.position.coords[0], circleCenterCoords[1] - arcShape.position.coords[1]];
	const angle = Math.atan2(delta[1], delta[0]);
	const offsetAngle = Math.asin(radius / d);
	// if angle - offsetAngle is in range and angle + offsetAngle is in range
	if (arcShape.angle > 0) {
		if (arcShape.rotationRadians + arcShape.angle >= angle + offsetAngle &&
		arcShape.rotationRadians <= angle - offsetAngle)
			return true;
	}
	else {
		//if (arcShape.rotationRadians + arcShape.angle >= angle + offsetAngle &&
		
	}
	
	// FIXME: if angle +- the tan

	if (arcShape.style.getLineCap() === LineCap.Butt)
		return false;
	return true;
};