/*
This class represents the Point Cloud Data file format.

It includes functionality for loading information from .pcd files.

A PCD loader aimed at three.js is a useful reference:
https://gitlab.com/taketwo/three-pcd-loader/blob/master/pcd-loader.js#L96-112
*/
class PCDFileFormat extends PointCloudFileFormat {
	constructor() {
		super();
		// MIME is hard to predict for PCD files.
		// I couldn't find any associated MIME by 
		// searching a few file extension -> MIME listing websites.
		this.accept = '.pcd';
	}

	_loadAscii(meta, content, defaultRGB) {
		content = content.substring(meta.dataStartIndex).trim();
		var lines = content.split("\n");
		var result = [];
		// I'm avoiding map so that invalid lines get filtered out efficiently.
		lines.forEach(function(line) {
			var parts = line.split(/[\s,]+/);
			if (parts.length === meta.fieldsArray.length) {
				result.push(PCDFileFormat._createPoint(meta.fields, parts, defaultRGB));
			}
		});
		return result;
	}

	_loadCompressedBinary(meta, arrayBuffer, defaultRGB) {
		// decompress the data.
		var sizes = new Uint32Array(arrayBuffer.slice(0, 8))
		var compressedSize = sizes[0];
		var decompressedSize = sizes[1];
		var decompressed = decompressLZF(new Uint8Array(arrayBuffer, 8, compressedSize), decompressedSize);

		return this._loadBinary(meta, decompressed.buffer, defaultRGB);
	}

	_loadBinary(meta, arrayBuffer, defaultRGB) {
		var dataArrayView = new DataView(arrayBuffer, 0, arrayBuffer.byteLength);
		const littleEndian = true;
		var result = [];
		var row = 0;
		for (var p = 0; p < meta.points && row < arrayBuffer.byteLength; row += meta.rowSize, p++) {
			var x = 0, y = 0, z = 0;
			var i = row + meta.fieldOffsets.x;
			x = dataArrayView.getFloat32(i, littleEndian);
			y = dataArrayView.getFloat32(row + meta.fieldOffsets.y, littleEndian);
			z = dataArrayView.getFloat32(row + meta.fieldOffsets.z, littleEndian);
			var r = defaultRGB.r, g = defaultRGB.g, b = defaultRGB.b;
			if (meta.fieldOffsets.rgb !== undefined) {
				r = dataArrayView.getUint8(row + meta.fieldOffsets.rgb + 0) / 255.0;
				g = dataArrayView.getUint8(row + meta.fieldOffsets.rgb + 1) / 255.0;
				b = dataArrayView.getUint8(row + meta.fieldOffsets.rgb + 2) / 255.0;
			}
			if (isNaN(x) || isNaN(y) || isNaN(z)) {
				console.error('Unable to decode float for x, y, z at index ' + p + ', x = ' + x + ', y = ' + y + ', z = ' + z);
				if (isNaN(x))
					x = 0;
				if (isNaN(y))
					y = 0;
				if (isNaN(z))
					z = 0;
			}
			var newPoint = new Point([x, y, z], r, g, b);
			result.push(newPoint);
		}

		return new Promise(function(resolver, rejecter) {
			resolver(result);
		});
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
				var meta = outer._getMeta(content);
				if (meta.data === 'ascii') 
					resolver(outer._loadAscii(meta, content, defaultRGB));
				else {
					reader.readAsArrayBuffer(file);
					reader.onload = function(evt) {
						var data = evt.target.result;
						var len = meta.dataStartIndex;
						data = data.slice(len, data.byteLength);
						if (meta.data === 'binary_compressed')
							resolver(outer._loadCompressedBinary(meta, data, defaultRGB));
						else
							resolver(outer._loadBinary(meta, data, defaultRGB));
					}
				}
			};
		});
	}

	_sanitizeMeta(meta) {
		if (meta.data === undefined)
			meta.data = 'ascii'; // assume it is ASCII if it isn't specified.
		else
			meta.data = meta.data.toLowerCase();
		if (meta.fields === undefined)
			meta.fields = 'x y z';
		if (typeof meta.points === 'string')
			meta.points = parseInt(meta.points);

		// convert fields from string to sanitized Array of column names.
		meta.fieldsArray = meta.fields.split(/[\s,]+/).map(function(s) {
			return s.trim().toLowerCase();
		});
		// convert fields array into an object mapping column name to column index.
		meta.fields = {};
		meta.fieldsArray.forEach(function(key, index) {
			meta.fields[key] = index;
		});
		if (meta.size === undefined) {
			meta.size = '';
			// assume every field takes 4 bytes because it usually does.
			for (var i = 0; i < meta.fieldsArray.length; i++) {
				meta.size += '4 ';
			}
			meta = meta.size.trim();
		}
		var rowSize = 0;
		meta.fieldOffsets = {};
		meta.size = meta.size.split(/[\s,]+/).map(function(s, index) {
			var result = parseInt(s.trim());
			var key = meta.fieldsArray[index];
			meta.fieldOffsets[key] = rowSize;
			rowSize += result;
			return result;
		});
		meta.rowSize = rowSize;
	}

	_validateMeta(meta) {
		if (meta.fields.x === undefined || meta.fields.y === undefined || meta.fields.z === undefined)
			throw new Error('x, y, z are all required fields for PCD but one or more are missing in: ' 
				+ JSON.stringify(meta.fieldsArray));
		if (typeof meta.points !== 'number' || isNaN(meta.points))
			throw new Error('points must be an int.');
		if (meta.size.length !== meta.fieldsArray.length)
			throw new Error('The number of sizes in size should match the number of fields. ' 
				+ meta.size.length + ' != ' + meta.fieldsArray.length);
		if (typeof meta.rowSize !== 'number' || isNaN(meta.rowSize))
			throw new Error('Unable to calculate number of bytes in each row of uncompressed data.  Specified size is invalid.');
	}

	_getMeta(content) {
		var result = {};
		var dataStartIndex = 0;
		// split lines.
		var lines = content.split("\n");
		lines.forEach(function(line) {
			if (result.data === undefined)
				dataStartIndex += line.length + 1;
			line = line.trim();
			var index = line.search(/\s/g);
			// if there is no whitespace in the line, ignore it.
			if (index > 0) {
				var key = line.substring(0, index).trim().toLowerCase();
				// if the key contains anything other than letters, ignore it.
				if (/^[a-z]+$/i.test(key)) {
					var value = line.substring(index + 1).trim();
					// Avoid setting if non-ASCII characters are found in value.
					// This is useful if compressed binary data is in the file.
					if (/^[\u0000-\u007f]*$/.test(value)) {
						result[key] = value;
					}
				}
			}
		});
		result.dataStartIndex = dataStartIndex;
		this._sanitizeMeta(result);
		return result;
	}
}

PCDFileFormat._createPoint = function(fields, dataParts, defaultRGB) {
	var coords = [
		parseFloat(dataParts[fields.x]),
		parseFloat(dataParts[fields.y]),
		parseFloat(dataParts[fields.z])
	];
	var r = defaultRGB.r, g = defaultRGB.g, b = defaultRGB.b;
	if (fields.rgb || fields.rgba) {
		var c;
		if (fields.rgb)
			c = new Float32Array([parseFloat(dataParts[fields.rgb])]);
		else
			c = new Uint32Array([parseInt(dataParts[fields.rgba])]);

		var dataview = new Uint8Array(c.buffer, 0);
		b = dataview[0] / 255.0;
		g = dataview[1] / 255.0;
		r = dataview[2] / 255.0;
	}
	return new Point(coords, r, g, b);
}