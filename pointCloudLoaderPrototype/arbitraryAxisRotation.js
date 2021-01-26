// These arbitrary axis rotation functions depend on math.js.
// This makes use of discussions at https://www.sololearn.com/Discuss/2708222/how-to-rotate-a-3d-point-around-arbitrary-axis-in-javascript
// More specifically, visph's answer.

// Define a class to be used like a namespace.
// I just want to reduce risk of a function name clashing with an existing function.
class ArbitraryAxisRotation {
}

ArbitraryAxisRotation._getRotationMatrixForAxis = function(angle, axis) {
	var cosTheta = Math.cos(angle);
	var sinTheta = Math.sin(angle);
	var matrixData;
	if (axis === 0) {
		matrixData = [
			[1, 0, 0],
			[0, cosTheta, -sinTheta],
			[0, sinTheta, cosTheta]
		];
	}
	else if (axis === 1) {
		matrixData = [
			[cosTheta, 0, sinTheta],
			[0, 1, 0],
			[-sinTheta, 0, cosTheta]
		];
	}
	else {
		matrixData = [
			[cosTheta, -sinTheta, 0],
			[sinTheta, cosTheta, 0],
			[0, 0, 1]
		];
	}

	return matrixData;
};


/*
@param axisX, axisY, axisZ would be components of a direction vector representing the arbitrary axis of rotation.  The vector can be assumed to have a length of 1(a unit vector).
@param radians would be an angle of rotation
@param point would be something like an Array of length 3 with 3 numbers.  This is the point to get rotated.
*/
ArbitraryAxisRotation.rotateArbitrary = function(axisX, axisY, axisZ, radians, point) {
	var info = ArbitraryAxisRotation.getRotateArbitraryAxisMatrices(axisX, axisY, axisZ, radians);
	return ArbitraryAxisRotation.rotateArbitraryUsingInfo(info, point);
};

ArbitraryAxisRotation.rotateArbitraryUsingInfo = function(info, point) {
	point = math.multiply(point, info.toX);
	point = math.multiply(point, info.xAxisRotation);
	point = math.multiply(point, info.fromX);
	return point;
};

ArbitraryAxisRotation.getArbitraryAxisMatrices = function(axisX, axisY, axisZ) {
	var toX;
	var fromX;
	var angles = [];
	var axis = [axisX, axisY, axisZ];
	angles.push(Math.atan2(axisZ, axisX));
	var rm = ArbitraryAxisRotation._getRotationMatrixForAxis(angles[angles.length - 1], 1);
	axis = math.multiply(axis, rm);
	toX = rm;
	angles.push(Math.atan2(axis[1], axis[0]));
	rm = ArbitraryAxisRotation._getRotationMatrixForAxis(angles[angles.length - 1], 2);
	axis = math.multiply(axis, rm);
	toX = math.multiply(toX, rm);
	fromX = ArbitraryAxisRotation._getRotationMatrixForAxis(-angles[1], 2);
	fromX = math.multiply(fromX, ArbitraryAxisRotation._getRotationMatrixForAxis(-angles[0], 1));
	
	return {
		'toX': toX,
		'fromX': fromX
	};
};

ArbitraryAxisRotation.getRotateArbitraryAxisMatrices = function(axisX, axisY, axisZ, radians) {
	var info = ArbitraryAxisRotation.getArbitraryAxisMatrices(axisX, axisY, axisZ);
	var xAxisRotation = ArbitraryAxisRotation._getRotationMatrixForAxis(radians, 0);

	return {
		'toX': info.toX,
		'fromX': info.fromX,
		'xAxisRotation': xAxisRotation,
		'fromXAxisRotation': ArbitraryAxisRotation._getRotationMatrixForAxis(-radians, 0)
	};
};