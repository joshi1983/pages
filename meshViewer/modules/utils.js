/*
Converts an Array of Array of number to an Array of number.
*/
function flattenArray(a) {
	var result = [];
	a.forEach(function(ae) {
		ae.forEach(function(ae1) {
			result.push(ae1);
		});
	});
	return result;
}

function getRotationMatrixForAxis(angle, axis) {
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
}

function getRotationMatrix(rotationAngles, reverseDirection) {
	var result;
	if (reverseDirection) {
		result = getRotationMatrixForAxis(rotationAngles[2], 2);
		for (var i = 1; i >= 0; i--) {
			result = math.multiply(getRotationMatrixForAxis(rotationAngles[i], i), result);
		}
	}
	else {
		result = getRotationMatrixForAxis(rotationAngles[0], 0);
		for (var i = 1; i < 3; i++) {
			result = math.multiply(getRotationMatrixForAxis(rotationAngles[i], i), result);
		}
	}
	return result;
}


// mixVectors is like the mix function from OpenGL ES.
// assumes v1.length === v2.length
// assumes every element in v1 and v2 is a number.
function mixVectors(v1, v2, ratio) {
	var result = [];
	var ratio1 = 1 - ratio;
	for (var i = 0; i < v1.length; i++) {
		result.push(v1[i] * ratio + v2[i] * ratio1);
	}

	return result;
}

function getRandomColourValue() {
	return 0.5 + Math.random() * 0.5;
}

function getRandomColour() {
	return [
		getRandomColourValue(),
		getRandomColourValue(),
		getRandomColourValue()
	];
}

export { flattenArray, getRandomColour, mixVectors, getRotationMatrix, getRotationMatrixForAxis };