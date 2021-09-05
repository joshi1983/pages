import { ArcShape } from '../../../../modules/drawing/vector/shapes/ArcShape.js';
import { CircleShape } from '../../../../modules/drawing/vector/shapes/CircleShape.js';
import { CylinderShape } from '../../../../modules/drawing/vector/shapes/CylinderShape.js';
import { dtoToJSON } from '../../../../modules/drawing-menu/shape-explorer/serialization/dtoToJSON.js';
import { shapeToDetailsDTO } from '../../../../modules/drawing-menu/shape-explorer/serialization/shapeToDetailsDTO.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testDtoToJSON(logger) {
	const shapes = [
		new ArcShape(new Vector3D(0, 0, 0), 0, 100, Math.PI),
		new CircleShape(new Vector3D(0, 0, 0), 100),
		new CylinderShape(new Vector3D(0, 0, 0), new Vector3D(100, 0, 50), 50)
	];
	shapes.forEach(function(shape) {
		const dto = shapeToDetailsDTO(shape);
		const json = dtoToJSON(dto);
		if (typeof json !== 'string')
			logger('Expected a string but got ' + json);
	});
};