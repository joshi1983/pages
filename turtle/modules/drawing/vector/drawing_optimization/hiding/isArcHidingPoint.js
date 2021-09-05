import { isPenOpaque } from
'./isPenOpaque.js';
import { LineCap } from
'../../shapes/style/LineCap.js';
import { Vector } from
'../../Vector.js';
import { Vector2D } from
'../../Vector2D.js';

// arcShape should be an instance of ArcShape class.
export function isArcHidingPoint(arcShape, pointCoords) {
	if (!(pointCoords instanceof Array))
		throw new Error(`pointCoords must be an Array but found ${pointCoords}`);
	if (pointCoords.length === 2)
		pointCoords[2] = arcShape.position.coords[2];

	const offsetCoords = Vector.minusCoords(arcShape.position.coords, pointCoords);
	const d = Vector.euclideanDistance(offsetCoords);
	const halfPenWidth = arcShape.style.getPenWidth() / 2;
	if (d >= arcShape.radius - halfPenWidth &&
	d <= arcShape.radius + halfPenWidth) {
		if (isPenOpaque(arcShape.style)) {
			const angle = Math.atan2(offsetCoords[1], offsetCoords[0]);
			if (arcShape.angle > 0 &&
			angle >= arcShape.rotationRadians &&
			angle <= arcShape.rotationRadians + arcShape.angle)
				return true;
			if (arcShape.angle < 0 &&
			angle >= arcShape.rotationRadians + arcShape.angle &&
			angle <= arcShape.rotationRadians)
				return true;

			if (arcShape.style.getLineCap() !== LineCap.Butt) {
				const p1 = arcShape.getStartPoint();
				const p2 = arcShape.getEndPoint();
				const d2 = Math.min(Vector2D.distance(p1.coords, pointCoords), Vector2D.distance(p2.coords, pointCoords));
				if (d2 <= arcShape.style.getPenWidth() / 2)
					return true; // Square line caps hide round caps so this is true for both cases.
				if (arcShape.style.getLineCap() === LineCap.Square) {
					// FIXME: check if pointCoords is in the rectangular bounds of a "square" line cap.
				}
			}
			return false;
		}
	}
	return false;
};