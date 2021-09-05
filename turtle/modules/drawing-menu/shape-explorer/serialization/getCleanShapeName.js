export function getCleanShapeName(shape) {
	let result = shape.constructor.name;
	if (result.toLowerCase().endsWith('shape'))
		result = result.substring(0, result.length - 5);
	return result;
}