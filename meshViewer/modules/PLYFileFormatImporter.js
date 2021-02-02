import { MeshFileFormatImporter } from './MeshFileFormatImporter.js';
import { Triangle } from './Triangle.js';
import { Vertex } from './Vertex.js';

export class PLYFileFormatImporter extends MeshFileFormatImporter {
	constructor() {
		super();
		this.accept = '.ply';
	}

	_sanitizeDataType(typeName) {
		// convert some synonymous types.
		const conversions = {
			'float': 'float32',
			'int': 'int32',
			'ulong': 'uint64',
			'long': 'int64', 
			// just in case "long" shows up.  long wasn't mentioned in the wikipedia article, though.
			'ushort': 'uint16',
			'short': 'int16',
			'double': 'float64',
			'uchar': 'uint8',
			'char': 'int8'
		};
		if (conversions[typeName] === undefined)
			return typeName;
		else
			return conversions[typeName];
	}

	_getByteSize(typeName) {
		const keys = {
			'float32': 4,
			'float64': 8,
			'int8': 1,
			'uint8': 1,
			'int16': 2,
			'uint16': 2,
			'int32': 4,
			'uint32': 4,
			// 64-bit integers not mentioned in wikipedia article but trying to 
			// make this loader robust enough to handle them anyway.
			'int64': 8, 
			'uint64': 8
		};
		if (keys[typeName] === undefined)
			return 4;
		else
			return keys[typeName];
	}

	_isFaceName(s) {
		if (s === 'vertex')
			return false;

		return s === 'range_grid' || s === 'face';
	}

	_getHeaderInfo(context) {
		var lines = context.split("\n");
		var properties = [];
		var inVertex = false;
		var count = 0;
		var headerEndOffset = 0;
		var faceCount;
		var format;
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			headerEndOffset += line.length + 1;
			line = line.trim().toLowerCase();
			var parts = line.split(/\s+/);
			if (parts.length >= 3 && parts[0] === 'element' && this._isFaceName(parts[1])) {
				faceCount = parseInt(parts[2]);
			}
			if (parts.length > 0 && parts[0] === 'end_header') {
				break;
			}
			else if (parts.length > 0 && parts[0] === 'format') {
				format = parts[1];
			}
			else if (!inVertex && parts.length > 2 && parts[0] === 'element' && parts[1] === 'vertex') {
				inVertex = true;
				count = parseInt(parts[2]);
			}
			else if (inVertex && parts.length > 1 && parts[0] === 'element') {
				inVertex = false;
			}
			else if (inVertex && parts.length > 2 && parts[0] === 'property') {
				var dataType = this._sanitizeDataType(parts[1]);
				properties.push({
					'type': dataType,
					'typeSize': this._getByteSize(dataType),
					'name': parts[2]
				});
			}
		}
		var propertyIndexes = {};
		var propertyObjects = {};
		properties.forEach(function(property, index) {
			propertyIndexes[property.name] = index;
			propertyObjects[property.name] = property;
		});
		return {
			"headerEndOffset": headerEndOffset,
			"vertexCount": count,
			"faceCount": faceCount,
			"format": format,
			"properties": properties,
			"propertyIndexes": propertyIndexes,
			"propertyObjects": propertyObjects
		};
	}

	_loadAscii(headerInfo, content, defaultRGB) {
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

	_getNumber(headerInfo, propertyKey, dataView, useLittleEndian, rowOffset, defaultValue, scaleFactor) {
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

	_loadBinary(headerInfo, arrayBuffer, useLittleEndian, defaultRGB) {
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
			x = this._getNumber(headerInfo, 'x', dataView, useLittleEndian, rowOffset);
			y = this._getNumber(headerInfo, 'y', dataView, useLittleEndian, rowOffset);
			z = this._getNumber(headerInfo, 'z', dataView, useLittleEndian, rowOffset);
			r = this._getNumber(headerInfo, 'red', dataView, useLittleEndian, rowOffset, defaultRGB.r, 1/255);
			g = this._getNumber(headerInfo, 'green', dataView, useLittleEndian, rowOffset, defaultRGB.g, 1/255);
			b = this._getNumber(headerInfo, 'blue', dataView, useLittleEndian, rowOffset, defaultRGB.b, 1/255);

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
						var len = headerInfo.headerEndOffset;
						data = data.slice(len, data.byteLength);
						if (headerInfo.format === 'binary_big_endian')
							resolver(outer._loadBinary(headerInfo, data, false, defaultRGB));
						else if (headerInfo.format === 'binary_little_endian')
							resolver(outer._loadBinary(headerInfo, data, true, defaultRGB));
						else
							throw new Error('Unsupported format: ' + headerInfo.format);
					}
				}
			};
		});
	}
}