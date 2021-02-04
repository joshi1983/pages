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
}

Triangle.getVertices = function(triangles) {
	var result = [];
	for (var i = 0; i < triangles.length; i++) {
		for (var v = 0; v < 3; v++) {
			result.push(triangles[i].vertices[v]);
		}
	}
	return result;
};