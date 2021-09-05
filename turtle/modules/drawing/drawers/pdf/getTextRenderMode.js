import { Transparent } from '../../../Transparent.js';

export function getTextRenderMode(textShape) {
	const style = textShape.style;
	if (style.isPenVisible()) {
		if (style.getFillColor() === Transparent)
			return 'stroke';
		else
			return 'fillThenStroke';
	}
	else
		return 'fill';
};