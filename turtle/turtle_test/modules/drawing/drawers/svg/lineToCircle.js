import { CircleShape } from '../../vector/shapes/CircleShape.js';
import { ShapeStyle } from '../../vector/shapes/style/ShapeStyle.js';

// This is intended for lines with a length of 0 and a line cap of "round".
export function lineToCircle(line) {
	const style = new ShapeStyle();
	style.setFillColor(line.style.getPenColor());
	style.setPenWidth(0);
	if (line.style.getPenGradient() !== undefined)
		style.setFillGradient(line.style.getPenGradient());
	return new CircleShape(line.position, line.style.getPenWidth() * 0.5, style);
}