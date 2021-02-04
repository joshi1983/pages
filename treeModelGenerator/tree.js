class Tree {
	constructor(numBranches, spread, scaleFactor, minBranchLength) {
		if (numBranches === undefined)
			numBranches = 3;
		if (spread === undefined)
			spread = 0.5;
		if (minBranchLength === undefined)
			minBranchLength = 0.08;
		if (scaleFactor === undefined)
			scaleFactor = 0.8;

		this.trunkLength = 0.4;

		// prevent maximum call stack exceeded.
		if (numBranches > 1) {
			while (true) {
				var numCallsOneBranch = Math.ceil(-Math.log(this.trunkLength / minBranchLength) / Math.log(scaleFactor));
				var numCalls = Math.pow(numBranches, numCallsOneBranch - 1);
				if (numCalls < 25000)
					break;
				else {
					minBranchLength += 0.02;
				}
			}
		}
		
		this.trunkColour = [0.5, 0.3, 0.15];
		this.leafColour = [0.0, 0.7, 0.05];
		this.scaleFactor = scaleFactor;
		this.minBranchLength = minBranchLength;
		this.angle = 0.2;
		this.branchMatrices = [];
		for (var i = 0; i < numBranches; i++) {
			var a = i * Math.PI * 2 / numBranches;
			var sinA = Math.sin(a);
			var cosA = Math.cos(a);
			this.branchMatrices.push(getRotationMatrix([spread * cosA, 0, spread * sinA]));
		}
		var triangles = Cylinder.getTriangles(0.05, 1, 3);
		this.cylinderTriangles = triangles.map(function(triangle) {
			return triangle.getVertexCoordinatesGroupedByVertex();
		});
	}

	_getTransformedCylinder(orientationMatrix, len, displacement) {
		var outer = this;
		return this.cylinderTriangles.map(function(triangleCoords) {
			var vertices = triangleCoords.map(function(triangleVertex) {
				triangleVertex = math.multiply(triangleVertex, orientationMatrix)._data;
				return [
					triangleVertex[0] * len + displacement[0],
					triangleVertex[1] * len + displacement[1],
					triangleVertex[2] * len + displacement[2]
				];
			}).map(function(coords) {
				var ratio = 1 - len / outer.trunkLength;
				ratio *= ratio;
				return new Vertex(coords, mixVectors(outer.trunkColour, outer.leafColour, 1 - ratio));
			});
			return new Triangle(vertices);
		});
	}

	_getTriangles(orientationMatrix, displacement, len) {
		var result = [];
		// stop the recursion so it doesn't become an infinite loop.
		if (len < this.minBranchLength)
			return result;
		var vector = [0, len, 0];
		var endPoint = math.multiply(vector, orientationMatrix)._data;
		endPoint[0] += displacement[0];
		endPoint[1] += displacement[1];
		endPoint[2] += displacement[2];
		result.push(...this._getTransformedCylinder(orientationMatrix, len, displacement));
		len *= this.scaleFactor;
		var outer = this;
		this.branchMatrices.forEach(function(m) {
			var branchingMatrix = math.multiply(m, orientationMatrix);
			result.push(...outer._getTriangles(branchingMatrix, endPoint, len));
		});
		return result;
	}

	getTriangles() {
		var identityMatrix = math.identity(3);
		var displacement = [0, -0.6, 0];
		return this._getTriangles(identityMatrix, displacement, this.trunkLength);
	}
}