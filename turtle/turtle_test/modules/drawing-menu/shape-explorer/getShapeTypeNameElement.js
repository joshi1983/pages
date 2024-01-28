import { getCleanShapeName } from './serialization/getCleanShapeName.js';

export function getShapeTypeNameElement(shape) {
	const result = document.createElement('div');
	result.classList.add('type-name');
	result.innerText = getCleanShapeName(shape);
	return result;
};