import { Triangle } from '../Triangle.js';
import { Vertex } from '../Vertex.js';

export class PLYAsciiLoader {
	static load(headerInfo, content, defaultRGB) {
		// get the vertex element definition.
		var lines = content.substring(headerInfo.headerEndOffset).split("\n").map(function(line) {
			return line.trim();
		});
		var vertices = [];
		for (var i = 0; i < headerInfo.vertexCount; i++) {
			var line = lines[i];
			var parts = line.split(/\s+/);
			var r = defaultRGB.r, g = defaultRGB.g, b = defaultRGB.b; // default to black.

			// Does each vertex have a colour specified?
			if (parts.length > 3 && headerInfo.properties.length > 3) {
				if (headerInfo.propertyIndexes.red !== undefined)
					r = parseFloat(parts[headerInfo.propertyIndexes.red]) / 255.0;
				if (headerInfo.propertyIndexes.green !== undefined)
					g = parseFloat(parts[headerInfo.propertyIndexes.green]) / 255.0;
				if (headerInfo.propertyIndexes.blue !== undefined)
					b = parseFloat(parts[headerInfo.propertyIndexes.blue]) / 255.0;
			}
			vertices.push(new Vertex([
					parseFloat(parts[headerInfo.propertyIndexes.x]),
					parseFloat(parts[headerInfo.propertyIndexes.y]),
					parseFloat(parts[headerInfo.propertyIndexes.z])
				], [r, g, b]));
		}
		var triangles = [];
		var endOfFaceIndex = headerInfo.vertexCount + headerInfo.faceCount;
		for (var i = headerInfo.vertexCount; i < endOfFaceIndex; i++) {
			var triangleVertices = lines[i].split(/\s+/).slice(1).map(function(intstr) {
				var index = parseInt(intstr);
				if (isNaN(index)) {
					throw new Error('Unable to get integer value from: ' + intstr + ' in line: ' + lines[i]);
				}
				if (index < 0 || index >= vertices.length)
					throw new Error('Vertex index: ' + index + ' is out of range 0..' + (vertices.length - 1) + ' in line: ' + lines[i]);
				return vertices[index];
			});
			if (triangleVertices.length >= 3) {
				triangles.push(...Triangle.createTrianglesFromVertices(triangleVertices));
			}
		}

		return triangles;
	}

}