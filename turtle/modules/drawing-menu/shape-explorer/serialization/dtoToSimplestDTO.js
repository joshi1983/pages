import { Colour } from '../../../Colour.js';
import { Vector3D } from '../../../drawing/vector/Vector3D.js';

/*
Converts a data transfer object that may contain Colour or 
Vector3D objects into data that is completely ready to be JSON stringified.
*/
export function dtoToSimplestDTO(dto) {
	if (['boolean', 'number', 'string'].indexOf(typeof dto) !== -1)
		return dto;
	else if (dto instanceof Colour)
		return dto.toString();
	else if (dto instanceof Vector3D)
		return dto.coords;
	else if (dto instanceof Array) {
		return dto.map(elementDTO => dtoToSimplestDTO(elementDTO));
	}
	else if (typeof dto === 'object') {
		const result = {};
		for (let key in dto) {
			result[key] = dtoToSimplestDTO(dto[key]);
		}
		return result;
	}
	else
		throw new Error('Unable to process element: ' + dto);
};