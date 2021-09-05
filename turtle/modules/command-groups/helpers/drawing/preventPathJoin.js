const notMutatedClassNames = new Set([
	'circle', 'ellipse', 'ellipsearc',
	'rasterrectangle', 'sphere', 'text'
]);

function shouldBeMutated(shape) {
	if (shape === undefined)
		return false;
	let className = shape.constructor.name.toLowerCase();
	if (className.endsWith('shape'))
		className = className.substring(0, className.length - 'shape'.length);
	if (notMutatedClassNames.has(className))
		return false;
	if (className === 'path') {
		return !shape.isClosed;
	}
	return true;
}

export function preventPathJoin(drawing) {
	// get previous shape.
	const shapes = drawing.foreground.shapes;
	const latestShape = shapes[shapes.length - 1];
	// if there is no previous shape, throw an error with a message pointing that out.
	if (shouldBeMutated(latestShape)) {
		latestShape.preventPathJoin = true;
	}
};