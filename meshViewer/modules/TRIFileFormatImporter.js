import { MeshFileFormatImporter } from './MeshFileFormatImporter.js';
import { Triangle } from './Triangle.js';
import { Vertex } from './Vertex.js';

/*
The .tri file format is described at:
http://paulbourke.net/dataformats/tri/
*/
export class TRIFileFormatImporter extends MeshFileFormatImporter {
	constructor() {
		super();
		this.accept = '.tri';
	}

	_loadFromString(content) {
		var lines = content.split('\n').map(function(line) {
			return line.trim().replace(/\s+/g, ' ');
		});
		var parts = lines[0].split(' ');
		if (parts.length !== 2)
			throw new Error('Invalid TRI file format.  2 integers expected on first line but found ' + parts.length);
		var numVertices = parseInt(parts[0]);
		var numFaces = parseInt(parts[1]);
		var vertices = [];
		for (var i = 1; i <= numVertices; i++) {
			var line = lines[i];
			var parts = line.split(' ').map(function(s) {
				return parseFloat(s);
			});
			vertices.push(new Vertex(parts.slice(0, 3), parts.slice(6)));
		}
		var result = [];
		for (var i = numVertices + 1; i < lines.length; i++) {
			var triangleVertices = lines[i].split(' ').map(function(s) {
				var index = parseInt(s);
				if (index < 0 || index >= vertices.length)
					throw new Error('Vertex index(' + index + ') out of range 0..' + (vertices.length - 1));
				return vertices[index];
			});
			result.push(new Triangle(triangleVertices));
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