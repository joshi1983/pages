import { MeshFileFormatImporter } from './MeshFileFormatImporter.js';
import { Triangle } from './Triangle.js';
import { Vertex } from './Vertex.js';

class OBJFileFormatImporter extends MeshFileFormatImporter {
	constructor() {
		super();
		this.accept = '.obj';
	}

	_removeComment(line) {
		var index = line.indexOf('#');
		if (index !== -1)
			line = line.substring(0, index);
		return line.trim();
	}

	// Get the lines we care most about and sanitize a bit.
	_getLoadableLines(s) {
		var outer = this;
		return s.split("\n").map(function(line) {
			return outer._removeComment(line).replace(/\s+/g, ' ');
		}).filter(function(line) {
			if (line.length < 2)
				return false; // filter out empty lines.
			return line.startsWith('v ') || line.startsWith('f '); 
			// we only care about vertices and faces.
		});
	}

	_loadFromString(s) {
		var lines = this._getLoadableLines(s);
		var vertices = [];
		var triangles = [];
		var outer = this;
		lines.forEach(function(line) {
			var parts = line.split(' ');
			if (parts[0] === 'v') {
				if (parts.length !== 4 && parts.length !== 7)
					throw new Error('Invalid OBJ format.  Vertex must have 3 or 6 components.  Found one containing ' + (parts.length - 1) + ' in line: ' + line);
				var numbers = parts.slice(1).map(function(part) {
					var result = parseFloat(part);
					if (isNaN(result)) {
						var msg = 'Invalid OBJ format.  Vertex components must be floats.  Unable to parse float from: ' + part;
						console.error(msg);
						throw new Error(msg);
					}
					return result;
				});
				var position = numbers.slice(0, 3);
				var colour = [1, 1, 1];
				if (numbers.length === 6) {
					colour = numbers.slice(3, 6);
				}
				vertices.push(new Vertex(position, colour));
			}
			else {
				var faceVertices = [];
				for (var i = 1; i < parts.length; i++) {
					var part = parts[i];
					var index = part.indexOf('/');
					if (index !== -1)
						part = part.substring(0, index); // ignore normals, texture coordinates...
					var vertexIndex = parseInt(part);
					if (isNaN(vertexIndex))
						throw new Error('Invalid OBJ format.  Vertex index must be an integer.  Unable to get integer from ' + part + '.  Line: ' + line);
					if (vertexIndex === 0)
						throw new Error('Invalid OBJ format.  The vertex index should never be 0.  Sanitized line: ' + line);
					if (vertexIndex > vertices.length || vertexIndex < -vertices.length)
						throw new Error('Invalid OBJ format.  face vertex index(' +
							vertexIndex + ') is out of range -' + (vertices.length - 1) 
							+ '...-1. 1..' + vertices.length + ', sanitized line is: ' + line);
					if (vertexIndex > 0)
						faceVertices.push(vertices[vertexIndex - 1]);
					else
						faceVertices.push(vertices[vertices.length + vertexIndex]);
				}
				var newTriangles = OBJFileFormatImporter.getTrianglesFromVertexCoordinates(faceVertices);
				triangles.push(...newTriangles);
			}
		});
		return triangles;
	}

	loadFromFile(file) {
		var reader = new FileReader();
		reader.readAsText(file, "UTF-8");
		var outer = this;
		return new Promise(function(resolver, rejecter) {
			reader.onload = function (evt) {
				var content = evt.target.result;
				resolver(outer._loadFromString(content));
			};
		});
	}
}

OBJFileFormatImporter.getTrianglesFromVertexCoordinates = function(faceVertices) {
	if (faceVertices.length < 3) {
		return []; // weird case but just ignore it instead of throwing error.
	}

	// This is based on discussion at: 
	// https://stackoverflow.com/questions/23723993/converting-quadriladerals-in-an-obj-file-into-triangles
	var result = [];
	result.push(new Triangle(faceVertices.slice(0, 3)));
	for (var i = 3; i < faceVertices.length; i++) {
		result.push(new Triangle([
			faceVertices[i - 3],
			faceVertices[i - 1],
			faceVertices[i]
		]));
	}
	return result;
};

export { OBJFileFormatImporter };