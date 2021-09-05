import { ArcShape } from '../../../../modules/drawing/vector/shapes/ArcShape.js';
import { CircleShape } from '../../../../modules/drawing/vector/shapes/CircleShape.js';
import { pathToCircle } from '../../../../modules/drawing/vector/drawing_optimization/pathToCircle.js';
import { PathShape } from '../../../../modules/drawing/vector/shapes/PathShape.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

function testResult123Position(result, logger) {
	if (result.position.getX() !== 1)
		logger(`Expected x to be 1 but got ${result.position.getX()}`);
	if (result.position.getY() !== 2)
		logger(`Expected y to be 2 but got ${result.position.getY()}`);
	if (result.position.getZ() !== 3)
		logger(`Expected z to be 3 but got ${result.position.getZ()}`);
}

function testWith2Arcs(logger) {
	const radius = 10;
	const arc1 = new ArcShape(new Vector3D(1, 2, 3), 0, radius, Math.PI);
	const arc2 = new ArcShape(new Vector3D(1, 2, 3), Math.PI, radius, Math.PI);
	const path = new PathShape([arc1, arc2], true);
	const result = pathToCircle(path);
	if (!(result instanceof CircleShape))
		logger(`Expected a CircleShape but got ${result}`);
	else {
		testResult123Position(result, logger);
	}
	path.isClosed = false;
	const result2 = pathToCircle(path);
	if (!(result2 instanceof CircleShape))
		logger(`Expected a CircleShape but got ${result2}`);
	else
		testResult123Position(result2, logger);
}

function testWithSingleElement(logger) {
	const radius = 10;
	const arc = new ArcShape(new Vector3D(1, 2, 3), 0, radius, Math.PI * 2);
	const path = new PathShape([arc, new Vector3D(0, -radius, 0)], true);
	path.elements.pop(); // remove the vector.
	const result = pathToCircle(path);
	if (!(result instanceof CircleShape))
		logger(`Expected a CircleShape but got ${result}`);
	else if (result.radius !== radius)
		logger(`Expected radius of ${radius} but got ${result.radius}`);
	else {
		testResult123Position(result, logger);
	}
	path.isClosed = false;
	const result2 = pathToCircle(path);
	if (!(result2 instanceof CircleShape))
		logger(`Expected a CircleShape but got ${result2}`);
	else
		testResult123Position(result2, logger)
}

export function testPathToCircle(logger) {
	wrapAndCall([
		testWith2Arcs,
		testWithSingleElement,
	], logger);
};