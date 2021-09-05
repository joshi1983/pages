import { dtoToSimplestDTO } from './dtoToSimplestDTO.js';

export function dtoToJSON(dto) {
	const simplestDTO = dtoToSimplestDTO(dto);
	return JSON.stringify(simplestDTO);
};