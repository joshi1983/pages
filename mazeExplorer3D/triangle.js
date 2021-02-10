class Triangle {
	/*
	vertices should be an Array of Vertex.
	*/
	constructor(vertices) {
		if (!(vertices instanceof Array))
			throw new Error('Triangle vertices must be an Array.');
		if (vertices.length !== 3)
			throw new Error('Triangle vertices must have a length of 3 instead of ' + vertices.length);
		for (var i = 0; i < 3; i++) {
			if (!(vertices[i] instanceof Vertex))
				throw new Error('vertices[' + i + '] must be a Vertex.  Not: ' + vertices[i]);
		}
		this.vertices = vertices;
	}

	getVertexCoordinatesGroupedByVertex() {
		return this.vertices.map(function(vertex) {
			return vertex.position;
		});
	}

	getVertexCoordinates() {
		return flattenArray(this.getVertexCoordinatesGroupedByVertex());
	}

	getVertexColours() {
		return flattenArray(this.vertices.map(function(vertex) {
			return vertex.colour;
		}));
	}

	getNormal() {
		var a = math.subtract(this.vertices[1].position, this.vertices[0].position);
		var b = math.subtract(this.vertices[2].position, this.vertices[0].position);
		var result = math.cross(a, b);
		var m = Math.sqrt(math.dot(result, result));
		result = math.multiply(result, 1 / m);
		return result;
	}
}

Triangle.getTextureCoordinatesData = function(triangles) {
	var results = triangles.map(function(triangle) {
		return flattenArray(triangle.vertices.map(function(vertex) {
			return vertex.textureCoordinates;
		}));
	});
	return flattenArray(results);
};

Triangle.getNormalsData = function(triangles) {
	var triangleNormals = triangles.map(function(triangle) {
		return triangle.getNormal();
	});
	var results = [];
	for (var i = 0; i < triangleNormals.length; i++) {
		for (var j = 0; j < 3; j++) {
			results.push(triangleNormals[i]);
		}
	}

	return flattenArray(results);
};

Triangle.getVertices = function(triangles) {
	if (triangles.length > 0 && !(triangles[0] instanceof Triangle))
		throw new Error('Triangle.getVertices must be given an Array of Triangle.  Not a Triangle: ', triangles[0]);
	var result = [];
	for (var i = 0; i < triangles.length; i++) {
		for (var v = 0; v < 3; v++) {
			result.push(triangles[i].vertices[v]);
		}
	}
	return result;
};

Triangle.createTrianglesFromVertices = function(vertices) {
	if (vertices.length < 3) {
		return [];
	}
	var result = [new Triangle(vertices.slice(0, 3))];
	for (var i = 3; i < vertices.length; i++) {
		result.push(new Triangle([
			vertices[i - 3],
			vertices[i - 1],
			vertices[i]
		]));
	}

	return result;
};