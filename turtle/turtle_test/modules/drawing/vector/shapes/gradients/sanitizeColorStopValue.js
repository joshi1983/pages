import { AlphaColour } from '../../../../AlphaColour.js';
import { Colour } from '../../../../Colour.js';
import { EaseLinear } from '../../easing/EaseLinear.js';
import { EasingFunction } from '../../easing/EasingFunction.js';
import { GradientStopPoint } from './GradientStopPoint.js';
import { Transparent } from '../../../../Transparent.js';

export async function asyncInit() {
	await AlphaColour.asyncInit();
	await Colour.asyncInit();
};

const easeLinear = new EaseLinear();

export function sanitizeColorStopValue(stopPointInfo) {
	if (stopPointInfo instanceof GradientStopPoint)
		return stopPointInfo;

	let easing = easeLinear, colour = stopPointInfo;
	if (stopPointInfo instanceof Array && stopPointInfo.length === 2) {
		if (stopPointInfo[1] instanceof EasingFunction) {
			easing = stopPointInfo[1];
			colour = stopPointInfo[0];
		}
		else
			throw new Error(`Array of 2 found for colour when Colour, AlphaColour or Transparent expected`);
	}
	// convert the colour to a more internally useful data type.
	if (!(colour instanceof Colour) && Colour.canBeInterprettedAsColour(colour))
		colour = new Colour(colour);
	else if (!(colour instanceof AlphaColour) && AlphaColour.canBeInterprettedAsAlphaColour(colour))
		colour = new AlphaColour(colour);
	else if (colour !== Transparent && !(colour instanceof AlphaColour) && !(colour instanceof Colour)) {
		if (colour instanceof Array)
			throw new Error(`Array found for colour when Colour, AlphaColour or Transparent expected`);
		throw new Error(`colour must be a Colour, AlphaColour, or Transparent.  Not: ${colour}, typeof colour=${typeof colour}`);
	}
	return new GradientStopPoint(colour, easing);
};