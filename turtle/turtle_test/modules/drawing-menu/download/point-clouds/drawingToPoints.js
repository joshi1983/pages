import { AlphaColour } from '../../../AlphaColour.js';
import { ArrayUtils } from '../../../ArrayUtils.js';
import { Colour } from '../../../Colour.js';
import { mixColourish } from '../../../command-groups/helpers/mixColourish.js';
import { PathShape } from '../../../drawing/vector/shapes/PathShape.js';
import { PointCloudPoint } from './PointCloudPoint.js';
import { Transparent } from '../../../Transparent.js';
import { Vector3D } from '../../../drawing/vector/Vector3D.js';
await Colour.asyncInit();
const black = new Colour(0, 0, 0);

function simplifyColour(colour) {
	/*
	This is true if a color stop references an easing function and a colour.
	*/
	if (colour.colour !== undefined)
		return colour.colour;
	else
		return colour;
}

function gradientToColour(gradient) {
	const colorStops = gradient.colorStops;
	const colorsToMix = [];
	for (const val of colorStops.values()) {
		if (val !== Transparent && val.colour !== Transparent)
			colorsToMix.push(val);
	}
	if (colorsToMix.length === 1)
		return colorsToMix[0];
	if (colorsToMix.length >= 2)
		return new AlphaColour(mixColourish(simplifyColour(colorsToMix[0]), simplifyColour(colorsToMix[1]), 0.5));
	/* 
	It would be nice to mix more than 2 colours if there are more but getting the blending 
	ratios correct for an even mix between all colours can be complicated.
	The ratios would need to be calculated like they are for merging snapshots for motion blur.
	*/
	return black;
}

function pathToPoints(path) {
	const elements = path.elements;
	const result = [];
	const colour = shapeToColour(path);
	for (let i = 0; i < elements.length; i++) {
		const element = elements[i];
		if (element instanceof Vector3D)
			result.push(new PointCloudPoint(element, colour));
		else
			ArrayUtils.pushAll(result, shapeToPoints(element));
	}
	return result;
}

function shapeToColour(shape) {
	const style = shape.style;
	const fillColor = style.getFillColor();
	const fillGradient = style.getFillGradient();
	const penColor = style.getPenColor();
	const penGradient = style.getPenGradient();
	if (style.isPenVisible()) {
		if (penGradient !== undefined)
			return gradientToColour(penGradient);
		return penColor;
	}
	else if (fillGradient !== undefined)
		return gradientToColour(fillGradient);
	else if (fillColor !== Transparent)
		return fillColor;
	return black;
}

function shapeToPoints(shape) {
	if (shape instanceof PathShape)
		return pathToPoints(shape);
	const result = [];
	const colour = shapeToColour(shape);
	if (typeof shape.getStartPoint === 'function')
		result.push(new PointCloudPoint(shape.getStartPoint(), colour));
	if (typeof shape.getEndPoint === 'function')
		result.push(new PointCloudPoint(shape.getEndPoint(), colour));
	if (result.length === 0)
		result.push(new PointCloudPoint(shape.position, colour));
	return result;
}

export function drawingToPoints(drawing) {
	const shapes = drawing.getShapesArray();
	const result = [];
	for (let i = 0; i < shapes.length; i++) {
		ArrayUtils.pushAll(result, shapeToPoints(shapes[i]));
	}
	return result;
};