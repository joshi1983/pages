import { Colour } from '../../../modules/Colour.js';
import { Transparent } from '../../../modules/Transparent.js';
import { Vector2DLayer } from '../../../modules/drawing/vector/Vector2DLayer.js';

export function testVector2DLayer(logger) {
	const layer = new Vector2DLayer();
	if (layer.shapes.length !== 0)
		logger('Expected 0 shapes but got ' + layer.shapes.length);
	if (layer.getFillColor() !== Transparent)
		logger('initial fill colour for a layer should be Transparent but got ' + layer.getFillColor());

	layer.setFillColor(new Colour('#f00'));
	if (!layer.getFillColor().equals(new Colour('#f00')))
		logger('After setting fill colour, fill colour expected to be ' +
			(new Colour('#f00')) + ' but got ' + layer.getFillColor());

	layer.setFillColor(Transparent);
	if (layer.getFillColor() !== Transparent)
		logger('fill colour should be Transparent but got ' + layer.getFillColor());
	
	let eventTriggered = false;
	layer.addEventListener('change', function(e) {
		if (typeof e.details.name !== 'string')
			logger('Event triggered which is good but the name must be a string. e = ' + JSON.stringify(e));
		eventTriggered = true;
	});
	layer.setFillColor(new Colour('#295'));
	if (!eventTriggered)
		logger('event should have been triggered when setting fill color');
	const numTainted = layer.countTaintedShapes();
	if (numTainted !== 0)
		logger('Expected 0 tainted shapes but got ' + numTainted);
	layer.removeTaintedShapes();
};