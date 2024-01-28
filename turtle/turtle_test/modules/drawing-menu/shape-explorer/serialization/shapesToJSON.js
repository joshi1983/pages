import { dtoToSimplestDTO } from './dtoToSimplestDTO.js';
import { shapeToDTO } from './shapeToDTO.js';

export function shapesToJSON(shapes) {
	const data = shapes.map(shape => dtoToSimplestDTO(shapeToDTO(shape)));
	return '[\n' +
		data.map(dto => '\t' + JSON.stringify(dto)).join(',\n') +
		'\n]';
};