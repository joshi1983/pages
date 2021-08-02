import { Triangle } from '../Triangle.js';
import { Vertex } from '../Vertex.js';

export class PLYBinaryLoader {
	static getNumber(headerInfo, propertyKey, dataView, useLittleEndian, rowOffset, defaultValue, scaleFactor) {
		var property = headerInfo.propertyObjects[propertyKey];
		if (property === undefined)
			return defaultValue;
		if (scaleFactor === undefined)
			scaleFactor = 1;
		var offset = rowOffset + property.byteOffset;
		var result;
		switch (property.type) {
			case 'float32':
				result = dataView.getFloat32(offset, useLittleEndian);
				break;
			case 'float64':
				result = dataView.getFloat64(offset, useLittleEndian);
				break;
			case 'uint8':
				result = dataView.getUint8(offset, useLittleEndian);
				break;
			case 'int8':
				result = dataView.getInt8(offset, useLittleEndian);
				break;
			case 'uint16':
				return dataView.getUint16(offset, useLittleEndian);
				break;
			case 'int16':
				result = dataView.getInt16(offset, useLittleEndian);
				break;
			case 'uint32':
				result = dataView.getUint32(offset, useLittleEndian);
				break;
			case 'int32':
				result = dataView.getInt32(offset, useLittleEndian);
				break;
			case 'uint64':
				result = dataView.getBigUInt64(offset, useLittleEndian);
				break;
			case 'int64':
				result = dataView.getBigInt64(offset, useLittleEndian);
				break;
			default:
				return 0;
		}
		return result * scaleFactor;
	}

	static load(headerInfo, arrayBuffer, useLittleEndian, defaultRGB) {
		var vertices = [];
		var rowOffset = 0;
		var rowByteSize = 0;
		// loop through the properties.
		headerInfo.properties.forEach(function(property) {
			property.byteOffset = rowByteSize;
			rowByteSize += property.typeSize;
		});
		var dataView = new DataView(arrayBuffer, 0, arrayBuffer.byteLength);
		for (var i = 0; i < headerInfo.vertexCount; i++) {
			var x, y, z, r, g, b;
			x = PLYBinaryLoader.getNumber(headerInfo, 'x', dataView, useLittleEndian, rowOffset);
			y = PLYBinaryLoader.getNumber(headerInfo, 'y', dataView, useLittleEndian, rowOffset);
			z = PLYBinaryLoader.getNumber(headerInfo, 'z', dataView, useLittleEndian, rowOffset);
			r = PLYBinaryLoader.getNumber(headerInfo, 'red', dataView, useLittleEndian, rowOffset, defaultRGB.r, 1/255);
			g = PLYBinaryLoader.getNumber(headerInfo, 'green', dataView, useLittleEndian, rowOffset, defaultRGB.g, 1/255);
			b = PLYBinaryLoader.getNumber(headerInfo, 'blue', dataView, useLittleEndian, rowOffset, defaultRGB.b, 1/255);

			vertices.push(new Vertex([x, y, z], [r, g, b]));
			rowOffset += rowByteSize;
		}
		var triangles = [];
		// loop through faces.
		for (var i = 0; i < headerInfo.faceCount && rowOffset < arrayBuffer.byteLength; i++) {
			var numVertices = dataView.getUint8(rowOffset);
			var faceVertices = [];
			rowOffset++;
			for (var j = 0; j < numVertices && rowOffset + 3 < arrayBuffer.byteLength; j++) {
				var vertexIndex = dataView.getUint32(rowOffset, useLittleEndian);
				faceVertices.push(vertices[vertexIndex]);
				rowOffset += 4;
			}
			if (faceVertices.length >= 3) {
				triangles.push(...Triangle.createTrianglesFromVertices(faceVertices));
			}
		}
		if (triangles.length !== headerInfo.faceCount) {
			console.error('Expected to load ' + headerInfo.faceCount + ' but only loaded ' + triangles.length + ' faces.');
		}
		return triangles;
	}
}