import { CircleShape } from '../../../../modules/drawing/vector/shapes/CircleShape.js';
import { shapeToDTO } from '../../../../modules/drawing-menu/shape-explorer/serialization/shapeToDTO.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testShapeToDTO(logger) {
	const circle = new CircleShape(new Vector3D(1, 2, 3), 100);
	const obj = shapeToDTO(circle);
	if (typeof obj !== 'object')
		logger(`obj expected to be an object but got ${obj}`);
	else if (obj.position === undefined)
		logger('Expected obj.position to be defined');
	else if (obj.radius === undefined)
		logger('Expected obj.radius to be defined');
	else if (typeof obj.type !== 'string')
		logger('Expected obj.type to be a string but got ' + obj.type);
};