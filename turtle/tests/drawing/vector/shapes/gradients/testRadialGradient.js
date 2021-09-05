import { Camera } from '../../../../../modules/drawing/vector/Camera.js';
import { Colour } from '../../../../../modules/Colour.js';
import { RadialGradient } from '../../../../../modules/drawing/vector/shapes/gradients/RadialGradient.js';
import { SpreadMethod } from '../../../../../modules/drawing/vector/shapes/gradients/SpreadMethod.js';
import { Vector2D } from '../../../../../modules/drawing/vector/Vector2D.js';

export function testRadialGradient(logger) {
	const gradient = new RadialGradient(new Map([
			[0, new Colour('#000')],
			[0.5, new Colour('#f00')],
			[1, new Colour('#0f0')]
		]), 
		new Vector2D(0, 0),
		new Vector2D(100, 200),
		300,
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
	else if (svgMarkup.indexOf('radialGradient') === -1)
		logger('Expected toSVGMarkup() to return a string containing "radialGradient" but it did not.  result = ' + svgMarkup);
	const cam = new Camera();
	const transformResult = gradient.transformBy(cam);
	if (!(transformResult instanceof RadialGradient))
		logger('Expected transformBy to return an instance of RadialGradient but got ' + transformResult);
	const str = gradient.toString();
	if (typeof str !== 'string')
		logger('Expected toString() to return a string but got: ' + str);
};