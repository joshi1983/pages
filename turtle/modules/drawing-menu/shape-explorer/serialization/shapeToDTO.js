import { getCleanShapeName } from './getCleanShapeName.js';
import { shapeToDetailsDTO } from './shapeToDetailsDTO.js';

export function shapeToDTO(shape) {
	const result = {
		'type': getCleanShapeName(shape),
		'position': shape.position,
	};
	Object.assign(result, shapeToDetailsDTO(shape));
	return result;
};