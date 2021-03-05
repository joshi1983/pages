import { Triangle } from './Triangle.js'
import { Vertex } from './Vertex.js'

class Cylinder {
	_getVal() {
		return 0.5 + Math.random() * 0.5;
	}

	_getColour() {
		return [
			this._getVal(),
			this._getVal(),
			this._getVal()
		];
	}

	getTriangles() {
		return Cylinder.getTriangles(0.1, 0.4, 5);
	}
}

Cylinder.getTriangles = function(radius, height, numSides) {
	var R = 0.1;
	var result = [];
	var vertices = [];
	for (var y = 0; y < numSides; y++) {
		var a = y / numSides * Math.PI * 2;
		var sinA = Math.sin(a);
		var cosA = Math.cos(a);
		vertices.push(new Vertex([
			radius * sinA,
			0,
			radius * cosA
		], getRandomColour()));
		a = (y + 0.5) / numSides * Math.PI * 2;
		sinA = Math.sin(a);
		cosA = Math.cos(a);
		vertices.push(new Vertex([
			radius * sinA,
			height,
			radius * cosA
		], getRandomColour()));
	}
	for (var y = 0; y < numSides; y ++) {
		var previousIndex = (y + numSides - 1) % numSides;
		previousIndex *= 2;
		var y2 = y * 2;
		result.push(new Triangle([vertices[y2], vertices[y2 + 1], vertices[previousIndex + 1]]));
		result.push(new Triangle([vertices[y2], vertices[previousIndex], vertices[previousIndex + 1]]));
	}
	return result;
};

export { Cylinder };