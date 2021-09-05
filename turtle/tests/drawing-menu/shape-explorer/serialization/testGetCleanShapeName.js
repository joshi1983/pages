import { CircleShape } from '../../../../modules/drawing/vector/shapes/CircleShape.js';
import { getCleanShapeName } from '../../../../modules/drawing-menu/shape-explorer/serialization/getCleanShapeName.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testGetCleanShapeName(logger) {
	const circle = new CircleShape(new Vector3D(1, 2, 3), 100);
	const shapeName = getCleanShapeName(circle);
	if (shapeName !== 'Circle')
		logger(`Expected shape name of Circle but got ${shapeName}`);
};