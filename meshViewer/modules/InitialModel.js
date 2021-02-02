import { Triangle } from './Triangle.js';
import { Vertex } from './Vertex.js';

export function getInitialModelTriangles() {
	var previousPoint;
	var previousColour;
	var result = [];
	
	for (var i = 0; i < 100; i++) {
		var r = Math.pow(1.1, (i + 1) * 0.1);
		var a1 = Math.sin(i * 0.15);
		var a2 = Math.cos(i * 0.0999);
		var nextColour = [(Math.sin(i * 0.2) + 1) * 0.5, (Math.cos(i * 0.21) + 1) * 0.5, 1];
		var x, y, z;
		x = r * Math.cos(a1) * Math.cos(a2);
		y = r * Math.sin(a2);
		z = r * Math.sin(a1) * Math.cos(a2);
		var nextPoint = [x, y, z];
		if (previousPoint !== undefined) {
			result.push(new Triangle([
				new Vertex(previousPoint, previousColour),
				new Vertex(nextPoint, nextColour),
				new Vertex([
					nextPoint[0] - 0.1 - r * 0.05,
					nextPoint[1] - 0.1 - r * 0.05,
					nextPoint[2] - 0.1 - r * 0.07
				], nextColour)
			]));
		}
		previousPoint = nextPoint;
		previousColour = nextColour;
	}
	return result;
}