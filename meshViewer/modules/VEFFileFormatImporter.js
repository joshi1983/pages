import { MeshFileFormatImporter } from './MeshFileFormatImporter.js';
import { OBJFileFormatImporter } from './OBJFileFormatImporter.js';
import { Triangle } from './Triangle.js';
import { Vertex } from './Vertex.js';

/*
The .vef file format is described at:
http://paulbourke.net/dataformats/vef/
*/
export class VEFFileFormatImporter extends MeshFileFormatImporter {
	constructor() {
		super();
		this.accept = '.vef';
	}

	_loadFromString(content) {
		var lines = content.split('\n').map(function(line) {
			var index = line.indexOf('#');
			if (index !== -1) // remove comment.
				line = line.substring(0, index);
			return line.trim().replace(/\s+/g, ' ');
		});
		var colour = [1, 1, 1];
		var numVertices = parseInt(lines[0]);
		var vertices = [];
		for (var i = 1; i <= numVertices; i++)
		{
			var parts = lines[i].split(' ').map(function(part) {
				return parseFloat(part);
			});
			vertices.push(new Vertex(parts, colour));
		}
		var numEdges = parseInt(lines[1 + numVertices]);
		var faceStartIndex = 3 + numVertices + numEdges;
		var result = [];
		for (var i = faceStartIndex; i < lines.length; i++)
		{
			var line = lines[i];
			var parts = line.split(' ').slice(1).map(function(part) {
				var index = parseInt(part);
				if (index < 0 || index >= vertices.length)
					throw new Error('Invalid vertex index(' + index + ') found in face line index ' + i + ' with contents: ' + line + '.  Vertex index must be in 0..' + (vertices.length - 1));
				return vertices[index];
			});
			var triangles = OBJFileFormatImporter.getTrianglesFromVertexCoordinates(parts);
			result.push(...triangles);
		}
		return result;
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