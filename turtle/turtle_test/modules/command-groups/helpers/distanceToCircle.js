import { solveQuadratic } from './solveQuadratic.js';
/*
Similar to the following WebLogo implementation:

to distanceToCircle :center :radius
	localmake "angle heading - (towards :center)
	localmake "d distance :center
	localmake "a 1
	localmake "b -2 * :d * (cos :angle)
	localmake "c (:d * :d) - (:radius * :radius)
	localmake "solutions solveQuadratic :a :b :c
	repeat count :solutions [
		localmake "val item repcount :solutions
		if :val >= 0 [
			output :val
		]
	]
	output -1 ; indicate no intersection found. 
end
*/
export function distanceToCircle(turtle, center, radius) {
	const angleDegrees = turtle.heading() - turtle.towards(center);
	const d = turtle.distance(center);
	const a = 1;
	const b = -2 * d * Math.cos(angleDegrees * Math.PI / 180);
	const c = d * d - radius * radius;
	const solutions = solveQuadratic(a, b, c);
	for (let i = 0; i < solutions.length; i++) {
		const solution = solutions[i];
		if (solution >= 0)
			return solution;
	}
	return -1 // indicate no intersection found. 
};