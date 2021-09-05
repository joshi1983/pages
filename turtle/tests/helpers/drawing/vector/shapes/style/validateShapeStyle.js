import { ShapeStyle } from '../../../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';

export function validateShapeStyle(style, logger) {
	if (!(style instanceof ShapeStyle))
		logger(`style expected to be a ShapeStyle but got ${style}`);
};