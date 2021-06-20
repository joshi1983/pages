

export class GLTFTransformer {
	setTransformationMatrix(m) {
		if (m instanceof Array) {
			if (m.length === 16) {
				var newM = [];
				for (var i = 0; i < 4; i++) {
					var row = [];
					for (var j = 0; j < 4; j++) {
						row.push(m[i * 4 + j]);
					}
					newM.push(row);
				}
				m = newM;
			}
			else if (m.length !== 4)
				throw new Error('Expected matrix to have length of 4 but found ' + m.length);

			m = math.matrix(m); // convert from array to instance of math.js's matrix.
		}
		else if (!(m instanceof math.Matrix))
			throw new Error('m must be an Array or a math.Matrix.');
		this.transformationMatrix = m;
	}

	_getTranslationMatrix(translation) {
		var values = [];
		for (var i = 0; i < 3; i++) {
			var row = [];
			for (var j = 0; j < 3; j++) {
				row.push(0);
			}
			row.push(translation[i]);
			values.push(row);
		}
		for (var i = 0; i < 3; i++)
			values[i][i] = 1;
		values.push([0, 0, 0, 1]);
		
		return math.matrix(values);
	}

	// Adapted from: 
	// https://www.programmingtil.com/contents/3d-math-quaternion-to-matrix-calculation
	_getRotationMatrix(rotation) {
		var nx = rotation[0];
		var ny = rotation[1];
		var nz = rotation[2];
		var t = rotation[3];
		var cosT = Math.cos(t);
		var sinT = Math.sin(t);
		var oMinusCosT = 1 - Math.cos(t);
		var values = [
			[
				nx*nx*oMinusCosT + cosT,
				nx*ny*oMinusCosT - nz*sinT,
				nx*nz*oMinusCosT + ny*sinT
			],
			[
				nx*ny*oMinusCosT+nz*sinT,
				ny*ny*oMinusCosT+cosT,
				ny*nz*oMinusCosT-nx*sinT,
			],
			[
				nx*nz*oMinusCosT-ny*sinT,
				ny*nz*oMinusCosT+nx*sinT,
				nz*nz*oMinusCosT+cosT
			]
		];
		values.push([0,0,0]);
		for (var i = 0; i < 4; i++)
			values[i].push(0);
		values[3][3] = 1;
		return math.matrix(values);
	}

	_getScaleMatrix(scale) {
		var values = [];
		for (var i = 0; i < 4; i++) {
			var row = [];
			for (var j = 0; j < 4; j++) {
				row.push(0);
			}
			values.push(row);
		}
		values[3][3] = 1;
		for (var i = 0; i < 3; i++)
			values[i][i] = scale[i];

		return math.matrix(values);
	}

	setTranslationRotationAndScale(translation, rotation, scale) {
		var matrix = math.identity(4, 4); // load identity matrix.
		if (translation instanceof Array && translation.length === 3) {
			matrix = math.multiply(matrix, this._getTranslationMatrix(translation));
		}
		if (rotation instanceof Array && rotation.length === 4) {
			matrix = math.multiply(matrix, this._getRotationMatrix(rotation));
		}
		if (scale instanceof Array && scale.length === 3) {
			matrix = math.multiply(matrix, this._getScaleMatrix(scale));
		}
		this.setTransformationMatrix(matrix);
	}

	transform(point) {
		if (!(point instanceof Array) || point.length !== 3)
			throw new Error('point must be an Array and with length 3.');
		for (var i = 0; i < 3; i++)
			if (typeof point[i] !== 'number' || isNaN(point[i]))
				throw new Error('point[' + i + '] must be a number but found: ' + point[i]);
		point = point.slice(0);
		point.push(1);
		var p = math.matrix(point);
		var result = math.multiply(this.transformationMatrix, p);
		return result._data.slice(0, 3);
	}
}