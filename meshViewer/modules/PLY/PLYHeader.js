import { PLYDataTypes } from './PLYDataTypes.js';

export class PLYHeader
{
	static isFaceName(s) {
		if (s === 'vertex')
			return false;

		return s === 'range_grid' || s === 'face';
	}

	static getHeaderInfo(context) {
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
			if (parts.length >= 3 && parts[0] === 'element' && PLYHeader.isFaceName(parts[1])) {
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
				var dataType = PLYDataTypes.sanitizeDataType(parts[1]);
				properties.push({
					'type': dataType,
					'typeSize': PLYDataTypes.getByteSize(dataType),
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

}