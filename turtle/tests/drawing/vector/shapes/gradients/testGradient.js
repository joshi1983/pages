import { Colour } from '../../../../../modules/Colour.js';
import { EaseEase } from '../../../../../modules/drawing/vector/easing/EaseEase.js';
import { Gradient } from '../../../../../modules/drawing/vector/shapes/gradients/Gradient.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { SpreadMethod } from '../../../../../modules/drawing/vector/shapes/gradients/SpreadMethod.js';
import { validateGradient } from '../../../../helpers/drawing/vector/shapes/gradients/validateGradient.js';
await Colour.asyncInit();
await Gradient.asyncInit();

const colourStops = new Map([[0, new Colour('red')], [1, new Colour('black')]]);
const colourStopsWithEasing = new Map([[0, new Colour('red')], [1, [new Colour('black'), new EaseEase()]]]);
const colourStopsArray = [colourStops, colourStopsWithEasing];

function testAddColorStopsToContext2dGradient(logger) {
	colourStopsArray.forEach(function(colourStops) {
		const gradient = new Gradient(colourStops, SpreadMethod.Pad);
		if (!validateGradient(gradient, logger))
			return;
		const numCycles = 2;
		const canvas = document.createElement('canvas');
		const context2D = canvas.getContext('2d');
		const context2dGradient = context2D.createLinearGradient (0, 0, 0, 100);
		gradient.addColorStopsToContext2dGradient(context2dGradient, numCycles);
	});
}

export function testGradient(logger) {
	testAddColorStopsToContext2dGradient(prefixWrapper('addColorStopsToContext2dGradient', logger));
};