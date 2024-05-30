import { Vector3D } from '../../drawing/vector/Vector3D.js';

export function orientationTowards(turtle, point) {
	const turtlePos = turtle.drawState.position.coords;
	const offset = [point[0] - turtlePos[0], point[1] - turtlePos[1],point[2] - turtlePos[2]];
	const offsetV = new Vector3D(offset);
	const m = offsetV.magnitude();
	// If offset distance is within a floating point error tolerance of 0,
	// just return the current orientation.
	if (m < 0.00001) {
		return turtle.orientation();
	}
	// reverse rotation.
	const reverse = turtle.orientation().inverse();
	const result = [];
	return result;
};