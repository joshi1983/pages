import { Orientation2D } from '../../drawing/vector/Orientation2D.js';
import { Vector3D } from '../../drawing/vector/Vector3D.js';

/*
Similar to the following WebLogo implementation:

to distanceToLine :point1 :point2
	localmake "oldPos pos
	localmake "oldHeading heading
	ifelse 2 = count :point1 [
		localmake "pos1 xyCor
	] [
		localmake "pos1 pos
	]
	localmake "d linePointDistance :point1 :point2 :pos1
	jumpTo :point1
	localmake "angle abs (:oldHeading - (towards :point2))
	localmake "result :d / abs sin :angle
	jumpTo :oldPos
	setHeading :oldHeading
	output :result
end
*/

export function distanceToLine(turtle, point1, point2) {
	if (point1.length === 2)
		point1 = new Vector3D(point1[0], point1[1], 0);
	else
		point1 = new Vector3D(point1);
	if (point2.length === 2)
		point2 = new Vector3D(point2[0], point2[1], 0);
	else
		point2 = new Vector3D(point2);
	const oldPos = turtle.pos();
	const oldHeading = turtle.heading();
	const orientationReverse = new Orientation2D(-oldHeading * Math.PI / 180);
	point1 = orientationReverse.rotate(point1.minus(oldPos));
	point2 = orientationReverse.rotate(point2.minus(oldPos));
	const direction = point2.minus(point1);
	if (direction.getX() === 0)
		return Number.MAX_VALUE; // better than throwing an error.
	const factor = -point1.getX() / direction.getX();
	return point1.getY() + factor * direction.getY();
};