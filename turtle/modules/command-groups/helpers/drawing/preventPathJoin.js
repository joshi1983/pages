export function preventPathJoin(drawing) {
	// get previous shape.
	const shapes = drawing.foreground.shapes;
	const latestShape = shapes[shapes.length - 1];
	// if there is no previous shape, throw an error with a message pointing that out.
	if (latestShape === undefined)
		throw new Error('preventJoinPath command was called before drawing any lines or arcs.  Fix this by calling a visible line.  See help on preventJoinPath to learn more.');

	latestShape.preventPathJoin = true;
};