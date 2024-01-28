import { AlphaColour } from '../../../AlphaColour.js';
import { Colour } from '../../../Colour.js';
import { Transparent } from '../../../Transparent.js';
await AlphaColour.asyncInit();
await Colour.asyncInit();

function simplifyColour(c) {
	if (c instanceof AlphaColour) {
		if (AlphaColour.isOpaque(c))
			return AlphaColour.getAsColour(c);
		else if (AlphaColour.isTransparent(c))
			return Transparent;
	}
	return c;
}

/*
AlphaColour is more flexible but also a little slower and 
more complex than Transparent and Colour.

For these reasons, replace any AlphaColour in the shape 
with Transparent or Colour whenever the values are meaningfully equal.
*/
export function avoidAlphaColour(style) {
	const penColor = style.getPenColor();
	const fillColor = style.getFillColor();
	if (style.isPenVisible() && penColor instanceof AlphaColour) {
		penColor = simplifyColour(penColor);
		if (penColor === Transparent && style.getPenGradient() === undefined)
			style.setPenWidth(0);
		else if (!(penColor instanceof AlphaColour))
			style.setPenColor(penColor);
	}
	if (style.getPenColor() === Transparent && style.getPenGradient() === undefined) {
		style.setPenWidth(0);
	}
	if (style.getFillGradient() === undefined &&
	fillColor instanceof AlphaColour) {
		fillColor = simplifyColour(fillColor);
		if (!(fillColor instanceof AlphaColour))
			style.setFillColor(fillColor);
	}
};