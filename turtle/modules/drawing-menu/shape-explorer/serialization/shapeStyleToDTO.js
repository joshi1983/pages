import { fontToDTO } from './fontToDTO.js';
import { materialToDTO } from './materialToDTO.js';
import { penToDTO } from './penToDTO.js';

export function shapeStyleToDTO(shapeStyle, keys) {
	if (!(keys instanceof Set)) {
		keys = new Set(['font', 'material', 'pen']);
	}
	const result = {};
	if (keys.has('pen'))
		result.pen = penToDTO(shapeStyle.pen);
	if (keys.has('material'))
		result.material = materialToDTO(shapeStyle.material);
	if (keys.has('font'))
		result.font = fontToDTO(shapeStyle.font);
	return result;
};