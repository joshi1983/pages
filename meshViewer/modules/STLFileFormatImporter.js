import { MeshFileFormatImporter } from './MeshFileFormatImporter.js';
import { Triangle } from './Triangle.js';
import { Vertex } from './Vertex.js';

export class STLFileFormatImporter extends MeshFileFormatImporter {
	constructor() {
		super();
		this.accept = '.stl';
	}

	_getHeaderInfo(content) {
		var format = 'ascii';
		var headerEndOffset = 0;
		if (content.indexOf("solid") !== 0) {
			format = 'binary';
			headerEndOffset = 80;
		}
		else {
			headerEndOffset = content.indexOf("\n") + 1;
		}
		return {
			'format': format,
			'headerEndOffset': headerEndOffset
		};
	}

	_loadAscii(headerInfo, content, defaultRGB) {
		var lines = content.substring(headerInfo.headerEndOffset).split("\n").slice(2).map(function(line) {
			return line.trim().replace(/\s+/g, ' ');
		});
		var r = defaultRGB.r, g = defaultRGB.g, b = defaultRGB.b;
		var result = [];
		for (var i = 0; i + 2 < lines.length; i += 7) {
			var vertices = [];
			for (var vIndex = 0; vIndex < 3; vIndex++) {
				var coordinates = lines[i + vIndex].split(' ').slice(1).map(function(part) {
					return parseFloat(part);
				});
				vertices.push(new Vertex(coordinates, [r, g, b]));
			}
			result.push(new Triangle(vertices));
		}
		return result;
	}

	_loadBinary(headerInfo, arrayBuffer, defaultRGB) {
		var r = defaultRGB.r, g = defaultRGB.g, b = defaultRGB.b;
		var result = [];
		var dataView = new DataView(arrayBuffer, 0, arrayBuffer.byteLength);
		var isLittleEndian = true;
		// get number of triangles.
		var numTriangles = dataView.getUint32(headerInfo.headerEndOffset, isLittleEndian);
		var byteOffset = headerInfo.headerEndOffset + 4;
		// We already read the 4 bytes for the number of triangles.
		for (var i = 0; i < numTriangles && byteOffset < arrayBuffer.byteLength; i++) {
			byteOffset += 3 * 4; // ignore bytes for the normal.
			var vertices = [];
			for (var vIndex = 0; vIndex < 3; vIndex++) {
				var coordinates = [];
				for (var coordinateIndex = 0; coordinateIndex < 3; coordinateIndex++) {
					coordinates.push(dataView.getFloat32(byteOffset, isLittleEndian));
					byteOffset += 4;
				}
				vertices.push(new Vertex(coordinates, [r, g, b]));
			}
			result.push(new Triangle(vertices));
			byteOffset += 2; // ignore the facet attributes data.
		}

		return result;
	}

	loadFromFile(file, defaultRGB) {
		if (typeof defaultRGB !== 'object')
			defaultRGB = {'r': 0, 'g': 0, 'b': 0};
		var reader = new FileReader();
		reader.readAsText(file, "UTF-8");
		var outer = this;
		return new Promise(function(resolver, rejecter) {
			reader.onload = function (evt) {
				var content = evt.target.result;
				var headerInfo = outer._getHeaderInfo(content);
				if (headerInfo.format === 'ascii')
					resolver(outer._loadAscii(headerInfo, content, defaultRGB));
				else {
					reader.readAsArrayBuffer(file);
					reader.onload = function(evt) {
						var data = evt.target.result;
						if (headerInfo.format === 'binary')
							resolver(outer._loadBinary(headerInfo, data, defaultRGB));
						else
							throw new Error('Unsupported format: ' + headerInfo.format);
					}
				}
			};
		});
	}
}
