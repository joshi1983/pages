import { ColourToRGBRatios } from './ColourToRGBRatios.js';
import { Transparent } from '../../../Transparent.js';

/*
style should be a ShapeStyle instance.
*/
export function shapeStyleToX3D(style, result) {
	const color = style.getFillColor();
	result.append('<Material');
	if (color !== Transparent) {
		result.append(` diffuseColor="${ColourToRGBRatios(color)}"`);
	}
	result.append('/>');
};