import { formatColorRatios } from './formatColorRatios.js';
import { Transparent } from '../../../Transparent.js';

export function updateFillStyle(psDrawer, shapeStyle) {
	if (shapeStyle.getFillColor() !== Transparent) {
		if (!shapeStyle.getFillColor().equals(psDrawer.color)) {
			psDrawer.color = shapeStyle.getFillColor();
			psDrawer.addLine(`${formatColorRatios(psDrawer.color)} setrgbcolor`);
		}
	}
};