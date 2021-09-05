import { EllipseShape } from
'../../../../modules/drawing/vector/shapes/EllipseShape.js'; 
import { Orientation3D } from
'../../../../modules/drawing/vector/Orientation3D.js'; 
import { OrientedCircleShape } from
'../../../../modules/drawing/vector/shapes/OrientedCircleShape.js'; 
import { Vector3D } from
'../../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

function testGetZProjectionShape(logger) {
	const orientation = new Orientation3D();
	orientation.rollRight(0.2);
	orientation.setPitchRadians(0.3);
	const orientedCircle = new OrientedCircleShape(
		new Vector3D(0, 0, 0), orientation, 100);
	const result = orientedCircle.getZProjectionShape();
	if (!(result instanceof EllipseShape))
		logger(`Expected EllipseShape but found ${result}`);
}

export function testOrientedCircleShape(logger) {
	wrapAndCall([
		testGetZProjectionShape
	], logger);
};