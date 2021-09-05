import { Colour } from '../../modules/Colour.js';
import { EllipseArcShape } from '../../modules/drawing/vector/shapes/EllipseArcShape.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { TurtleDrawState } from '../../modules/drawing/TurtleDrawState.js';
import { Vector3D } from '../../modules/drawing/vector/Vector3D.js';

function testBooleanMethods(logger) {
	const tds = new TurtleDrawState();
	if (tds.hasInitialOrientation() !== true)
		logger('Expected hasInitialOrientation() to return true initially');
	if (tds.isTurtleVisible !== true)
		logger('Expected turtle to initially show');
	tds.hideTurtle();
	if (tds.isTurtleVisible !== false)
		logger('Expected turtle to be hidden after calling hideTurtle');
	tds.showTurtle();
	if (tds.isTurtleVisible !== true)
		logger('Expected turtle to be visible');
	if (tds.isPenDown !== true)
		logger('Expected pen to initially be down');
	tds.penUp();
	if (tds.isPenDown !== false)
		logger('Expected pen to be up after calling penUp');
	tds.penDown();
	if (tds.isPenDown !== true)
		logger('Expected pen to be up after calling penDown');
	tds.setHeading(1);
	if (tds.hasInitialOrientation() !== false)
		logger('Expected hasInitialOrientation() to return false after setHeading(1) but got ' + tds.hasInitialOrientation());
}

function testEventDispatching(logger) {
	const tds = new TurtleDrawState();
	let eventTriggered = false;
	function listener() {
		eventTriggered = true;
	}
	tds.addEventListener('change', listener);
	tds.hideTurtle();
	if (eventTriggered === false)
		logger('Event expected to be triggered by hideTurtle() but it was not');
	eventTriggered = false;
	tds.showTurtle();
	if (eventTriggered === false)
		logger('Event expected to be triggered by showTurtle() but it was not');
	eventTriggered = false;
	tds.setPosition(new Vector3D(1,2,3));
	if (eventTriggered === false)
		logger('Event expected to be triggered by calling setPosition with coordinates 1,2,3 but it was not');
}

function testPenAndFillMethods(logger) {
	const tds = new TurtleDrawState();
	if (tds.getHeading() !== 0)
		logger('Expected initial heading to be 0 but got ' + tds.getHeading());
	tds.setHeading(0.1);
	if (tds.getHeading() !== 0.1)
		logger('Expected heading of 0.1 but got ' + tds.getHeading());
	tds.setPenWidth(5);
	if (tds.getPenWidth() !== 5)
		logger('expected pen width of 5 but got ' + tds.getPenWidth());
	tds.setPenColor(new Colour('#567'));
	if (!tds.getPenColor().equals(new Colour('#567')))
		logger('expected pen color of ' + (new Colour('#567')) + ' but got ' + tds.getPenColor());
	tds.setFillColor(new Colour('#234'));
	if (!tds.getFillColor().equals(new Colour('#234')))
		logger('expected fill color of ' + (new Colour('#234')) + ' but got ' + tds.getFillColor());
}

function testPositionMethods(logger) {
	const tds = new TurtleDrawState();
	if (tds.getX() !== 0)
		logger('Expected initial x to be 0 but got ' + tds.getX());
	if (tds.getY() !== 0)
		logger('Expected initial y to be 0 but got ' + tds.getY());
	if (tds.getZ() !== 0)
		logger('Expected initial z to be 0 but got ' + tds.getZ());
	tds.setX(4);
	if (tds.getX() !== 4)
		logger('Expected x of 4 but got ' + tds.getX());
	tds.setY(5);
	if (tds.getY() !== 5)
		logger('Expected y of 5 but got ' + tds.getY());
	tds.setZ(6);
	if (tds.getZ() !== 6)
		logger('Expected z of 6 but got ' + tds.getZ());
	const pos = tds.getPosition();
	if (JSON.stringify(pos.toArray()) !== '[4,5,6]')
		logger('Expected position to be [4,5,6] but got ' + JSON.stringify(pos.toArray()));

	tds.setPosition(new Vector3D(7, 8, 9));
	if (JSON.stringify(tds.getPosition().toArray()) !== '[7,8,9]')
		logger('Expected [7,8,9] but got "' + JSON.stringify(tds.getPosition().toArray()) + '"');

	tds.forward(3);
	if (JSON.stringify(tds.getPosition().toArray()) !== '[7,11,9]')
		logger('Expected [10,8,9] but got ' + JSON.stringify(tds.getPosition().toArray()));

	tds.right(Math.PI);
	if (tds.getHeading() !== Math.PI)
		logger('Expected to get heading of ' + Math.PI + ' but got ' + tds.getHeading());
}

function testShapeMethods(logger) {
	const tds = new TurtleDrawState();
	const result = tds.ellipseArc(Math.PI * 0.25, 100, 200, 0);
	if (!(result instanceof EllipseArcShape))
		throw new Error('Expected an instance of EllipseArcShape but got: ' + result);
}

export function testTurtleDrawState(logger) {
	testBooleanMethods(prefixWrapper('testBooleanMethods', logger));
	testEventDispatching(prefixWrapper('testEventDispatching', logger));
	testPenAndFillMethods(prefixWrapper('testPenAndFillMethods', logger));
	testPositionMethods(prefixWrapper('testPositionMethods', logger));
	testShapeMethods(prefixWrapper('testShapeMethods', logger));
};