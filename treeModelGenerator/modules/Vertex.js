

class Vertex {
	/*
	position should be an Array of 3 numbers.
	colour should be an Array of 3 numbers.
	*/
	constructor(position, colour) {
		this._validateArrayOfNumber(position, 'position');
		this._validateArrayOfNumber(colour, 'colour');
		this.position = position;
		this.colour = colour;
	}

	_validateArrayOfNumber(a, name) {
		if (!(a instanceof Array))
			throw new Error(name + ' must be an Array.');
		if (a.length !== 3)
			throw new Error(name + ' must have length 3.  Not: ' + a.length);
		for (var i = 0; i < 3; i++) {
			if (typeof a[i] !== 'number')
				throw new Error(name + '[' + i + '] must be a number.  Not ' + a[i]);
			if (isNaN(a[i]))
				throw new Error(name + '[' + i + '] must be a number.  It is actually an NAN.  Not ' + a[i]);
		}
	}

	_getHashStringForArray(a) {
		return a.join('_');
	}

	getHashString() {
		return this._getHashStringForArray(this.position) + '_' + this._getHashStringForArray(this.colour);
	}
}

Vertex.clone = function(vertex) {
	return new Vertex(vertex.position, vertex.colour);
};

Vertex.getPositionRangeInfoForAxis = function(vertices, axis) {
	var min = Number.MAX_VALUE;
	var max = -Number.MAX_VALUE;
	vertices.forEach(function(vertex) {
		min = Math.min(min, vertex.position[axis]);
		max = Math.max(max, vertex.position[axis]);
	});
	return {
		'min': min,
		'max': max,
		'length': max - min
	};
};

Vertex.getPositionRangeInfo = function(vertices) {
	var maxLen = 0;
	var mid = [];
	for (var i = 0; i < 3; i++) {
		var info = Vertex.getPositionRangeInfoForAxis(vertices, i);
		maxLen = Math.max(maxLen, info.length);
		mid.push((info.max + info.min) * 0.5);
	}
	return {
		'mid': mid,
		'length': maxLen
	};
};

Vertex.scaleAndTranslate = function(vertices, targetLength) {
	var info = Vertex.getPositionRangeInfo(vertices);
	var scaleFactor = targetLength / info.length;
	for (var i = 0; i < vertices.length; i++) {
		var vertex = vertices[i];
		if (vertex.position.length === 3) {
			for (var axis = 0; axis < 3; axis++) {
				vertex.position[axis] -= info.mid[axis];
				vertex.position[axis] *= scaleFactor;
			}
			vertex.position.push(0); // do something to indicate processed.
		}
	}
	info = Vertex.getPositionRangeInfo(vertices);
	
	// remove the property that we temperarily used.
	vertices.forEach(function(vertex) {
		if (vertex.position.length > 3)
			vertex.position.pop();
	});
};

export { Vertex };