import { Colour } from '../../../modules/Colour.js';
import { createTestDrawing } from '../../helpers/createTestDrawing.js';
import { SphereShape } from '../../../modules/drawing/vector/shapes/SphereShape.js';
import { Vector3D } from '../../../modules/drawing/vector/Vector3D.js';
import { Vector3DDrawing } from '../../../modules/drawing/vector/Vector3DDrawing.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testDefaultConstructor(logger) {
	const drawing = new Vector3DDrawing();
	if (drawing.getScreenColor() === null)
		logger('screen color expected to be white but got null');
	else if (!drawing.getScreenColor().equals(new Colour('#fff')))
		logger('screen color should have copied as white but got ' + drawing.getScreenColor());
}

function testCopyConstructor(logger) {
	const test2DDrawing = createTestDrawing();
	test2DDrawing.setScreenColor(new Colour('#f00'));
	test2DDrawing.setDimensions(123, 456);
	const drawing = new Vector3DDrawing(test2DDrawing);
	if (drawing.getScreenColor() === null)
		logger('screen color expected to be red but got null');
	else if (!drawing.getScreenColor().equals(new Colour('#f00')))
		logger('screen color should have copied as red but got ' + drawing.getScreenColor());
	if (drawing.width !== 123)
		logger('Expected width to be 123 but got ' + drawing.width);
	if (drawing.height !== 456)
		logger('Expected height to be 456 but got ' + drawing.height);
	const expectedNumShapes = test2DDrawing.getNonTurtleShapes().length;
	if (drawing.model.shapes.length !== expectedNumShapes)
		logger('Expected number of shapes to be ' + expectedNumShapes + ' but got ' + drawing.model.shapes.length);
}

function testListeners(logger) {
	const drawing = new Vector3DDrawing();
	let eventTriggered = false;
	drawing.addEventListener('change', function(e) {
		if (typeof e.details.name !== 'string')
			logger('Event triggered which is good but name must be a string.  e = ' + JSON.stringify(e));
		eventTriggered = true;
	});
	drawing.setScreenColor(new Colour('#123'));
	if (!eventTriggered)
		logger('change event should have been triggered');
	if (!drawing.getScreenColor().equals(new Colour('#123')))
		logger('screen color expected to be #112233 but got ' + drawing.getScreenColor());
}

function testMethods(logger) {
	const drawing = new Vector3DDrawing();
	if (drawing.hasAnythingToClear())
		logger('Expected false for hasAnythingToClear() but got ' + drawing.hasAnythingToClear());

	drawing.addForegroundShape(new SphereShape(new Vector3D(1, 2, 3), 10));
	if (drawing.model.shapes.length !== 1)
		logger('Expected to have 1 shape but got ' + drawing.model.shapes.length);
	const actualResult = drawing.hasAnythingToClear();
	if (actualResult !== true)
		logger('Expected true for hasAnythingToClear() but got ' + actualResult);
}

export function test3DDrawing(logger) {
	wrapAndCall([
		testCopyConstructor,
		testDefaultConstructor,
		testListeners,
		testMethods
	], logger);
}