class PLYFileFormat extends PointCloudFileFormat {
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

	_getHeaderInfo(context) {
		var lines = context.split("\n");
		var properties = [];
		var inVertex = false;
		var count = 0;
		var headerEndOffset = 0;
		var format;
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			headerEndOffset += line.length + 1;
			line = line.trim().toLowerCase();
			var parts = line.split(/\s+/);
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
			"format": format,
			"properties": properties,
			"propertyIndexes": propertyIndexes,
			"propertyObjects": propertyObjects
		};
	}

	_loadAscii(headerInfo, content, defaultRGB) {
		// get the vertex element definition.
		var lines = content.substring(headerInfo.headerEndOffset).split("\n");
		var result = [];
		for (var i = 0; i < headerInfo.vertexCount; i++) {
			var line = lines[i];
			var parts = line.trim().split(/\s+/);
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
			result.push(new Point([
					parseFloat(parts[headerInfo.propertyIndexes.x]),
					parseFloat(parts[headerInfo.propertyIndexes.y]),
					parseFloat(parts[headerInfo.propertyIndexes.z])
				], r, g, b));
		}
		return result;
	}

	_getNumber(headerInfo, propertyKey, dataView, useLittleEndian, rowOffset, defaultValue) {
		var property = headerInfo.propertyObjects[propertyKey];
		if (property === undefined)
			return defaultValue;
		var offset = rowOffset + property.byteOffset;
		switch (property.type) {
			case 'float32':
				return dataView.getFloat32(offset, useLittleEndian);
			case 'float64':
				return dataView.getFloat64(offset, useLittleEndian);
			case 'uint8':
				return dataView.getUint8(offset, useLittleEndian);
			case 'int8':
				return dataView.getInt8(offset, useLittleEndian);
			case 'uint16':
				return dataView.getUint16(offset, useLittleEndian);
			case 'int16':
				return dataView.getInt16(offset, useLittleEndian);
			case 'uint32':
				return dataView.getUint32(offset, useLittleEndian);
			case 'int32':
				return dataView.getInt32(offset, useLittleEndian);
			case 'uint64':
				return dataView.getBigUInt64(offset, useLittleEndian);
			case 'int64':
				return dataView.getBigInt64(offset, useLittleEndian);
			default:
				return 0;
		}
	}

	_loadBinary(headerInfo, arrayBuffer, useLittleEndian, defaultRGB) {
		var result = [];
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
			r = this._getNumber(headerInfo, 'red', dataView, useLittleEndian, rowOffset, defaultRGB.r);
			g = this._getNumber(headerInfo, 'green', dataView, useLittleEndian, rowOffset, defaultRGB.g);
			b = this._getNumber(headerInfo, 'blue', dataView, useLittleEndian, rowOffset, defaultRGB.b);
			
			result.push(new Point([x, y, z], r, g, b));
			rowOffset += rowByteSize;
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