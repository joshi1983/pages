import { convertToAlphaColourOrTransparent } from '../../../parsing/execution/instructions/data-type-converters/convertToAlphaColourOrTransparent.js';
import { isNumber } from '../../../isNumber.js';
import { LineCap } from '../../../drawing/vector/shapes/style/LineCap.js';

/*
This could eventually be available as a Logo procedure.
*/
export function stripes(turtle, width, height, colors) {
	if (!isNumber(width) || width <= 0)
		throw new Error(`width must be a positive number but got ${width}`);
	if (!isNumber(height) || height <= 0)
		throw new Error(`height must be a positive number but got ${height}`);
	if (!(colors instanceof Array))
		throw new Error(`colors must be a list of colors but got ${colors}`);
	if (colors.length === 0)
		throw new Error('colors must not be empty.');

	const oldState = turtle.turtleState();
	const step = height / colors.length;
	turtle.setLineCap(LineCap.Butt);
	turtle.setPenSize(width);
	for (let i = 0; i < colors.length; i++) {
		turtle.setPenColor(convertToAlphaColourOrTransparent(colors[i]));
		turtle.forward(step);
	}
	turtle.setTurtleState(oldState);
};