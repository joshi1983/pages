import { AlphaColour } from '../../../../../modules/AlphaColour.js';
import { Camera } from '../../../../../modules/drawing/vector/Camera.js';
import { Colour } from '../../../../../modules/Colour.js';
import { LinearGradient } from '../../../../../modules/drawing/vector/shapes/gradients/LinearGradient.js';
import { SpreadMethod } from '../../../../../modules/drawing/vector/shapes/gradients/SpreadMethod.js';
import { Transparent } from '../../../../../modules/Transparent.js';
import { Vector2D } from '../../../../../modules/drawing/vector/Vector2D.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';
await AlphaColour.asyncInit();
await Colour.asyncInit();

function testAlphacolorAndTransparent(logger) {
	const gradient = new LinearGradient(new Map([
			[0, new Colour('#000')],
			[0.5, Transparent],
			[1, new AlphaColour('#80f0')]
		]), 
		new Vector2D(0, 0),
		new Vector2D(100, 200),
		SpreadMethod.Pad);
}

function testEquals(logger) {
	const gradient = new LinearGradient(new Map([
			[0, new Colour('#000')],
			[0.5, new Colour('#f00')],
			[1, new Colour('#0f0')]
		]), 
		new Vector2D(0, 0),
		new Vector2D(100, 200),
		SpreadMethod.Pad);
	const gradient2 = new LinearGradient(new Map([
			[0, new Colour('#000')],
			[0.5, new Colour('#f00')],
			[1, new Colour('#0f0')]
		]), 
		new Vector2D(0, 0),
		new Vector2D(100, 200),
		SpreadMethod.Pad);
	gradient.getId();
	gradient2.getId();
	if (gradient.equals(gradient2) !== true)
		logger(`Expected linear gradients to be equal but got ${gradient.equals(gradient2)}`);
}

function testLinearGradientBasics(logger) {
	const gradient = new LinearGradient(new Map([
			[0, new Colour('#000')],
			[0.5, new Colour('#f00')],
			[1, new Colour('#0f0')]
		]), 
		new Vector2D(0, 0),
		new Vector2D(100, 200),
		SpreadMethod.Pad);
	if (gradient.colorStops.size !== 3)
		logger(`Expected a size of 3 but got ${gradient.colorStops.size}`);
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	const ctxGradient = gradient.createFromCanvas2DContext(ctx, 0, 0);
	ctx.fillStyle = ctxGradient;
	ctx.fillRect(20, 20, 150, 100);
	const svgMarkup = gradient.toSVGMarkup();
	if (typeof svgMarkup !== 'string')
		logger('Expected toSVGMarkup() to return a string but got something else.  result = ' + svgMarkup);
	else if (svgMarkup.indexOf('linearGradient') === -1)
		logger('Expected toSVGMarkup() to return a string containing "linearGradient" but it did not.  result = ' + svgMarkup);
	const cam = new Camera();
	const transformResult = gradient.transformBy(cam);
	if (!(transformResult instanceof LinearGradient))
		logger('Expected transformBy to return an instance of LinearGradient but got ' + transformResult);
	const str = gradient.toString();
	if (typeof str !== 'string')
		logger('Expected toString() to return a string but got: ' + str);
}

export function testLinearGradient(logger) {
	wrapAndCall([
		testAlphacolorAndTransparent,
		testEquals,
		testLinearGradientBasics
	], logger);
};