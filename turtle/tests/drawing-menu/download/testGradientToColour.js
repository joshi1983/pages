import { Colour } from '../../../modules/Colour.js';
import { createRadialGradient } from '../../../modules/drawing/turtle-draw-state/createRadialGradient.js';
import { gradientToColour } from '../../../modules/drawing-menu/download/gradientToColour.js';
import { SpreadMethod } from '../../../modules/drawing/vector/shapes/gradients/SpreadMethod.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { Vector2D } from '../../../modules/drawing/vector/Vector2D.js';
await Colour.asyncInit();

function colorsToGradient(colors) {
	const colorStops = new Map();
	for (let i = 0; i < arguments.length; i++) {
		colorStops.set(i / arguments.length, arguments[i]);
	}
	const radius = 100;
	const pos = new Vector2D(0, 0);
	return createRadialGradient(pos, pos, radius, colorStops, "pad");
}

function wrappedGradientToColour(gradient) {
	const c = gradientToColour(gradient);
	return c.toString();
}

export function testGradientToColour(logger) {
	const cases = [
	{'in': colorsToGradient(new Colour("black"), new Colour("black")), 'out': '#000000'},
	{'in': colorsToGradient(new Colour("white"), new Colour("white")), 'out': '#FFFFFF'},
	{'in': colorsToGradient(new Colour("red"), new Colour("black")), 'out': '#800000'}
	];
	testInOutPairs(cases, wrappedGradientToColour, logger);
};