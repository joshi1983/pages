import { Colour } from '../../Colour.js';
import { gradientToColour } from './gradientToColour.js';
import { styleToColour } from './styleToColour.js';
import { Transparent } from '../../Transparent.js';

const black = new Colour(0, 0, 0);

export function shapeToColour(shape) {
	const style = shape.style;
	const fillColor = style.getFillColor();
	const fillGradient = style.getFillGradient();
	const penColor = style.getPenColor();
	const penGradient = style.getPenGradient();
	if (style.isPenVisible()) {
		return styleToColour(style);
	}
	else if (fillGradient !== undefined)
		return gradientToColour(fillGradient);
	else if (fillColor !== Transparent)
		return fillColor;
	return black;
};