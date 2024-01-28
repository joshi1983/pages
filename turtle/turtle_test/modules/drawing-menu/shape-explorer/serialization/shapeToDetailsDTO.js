import { arcElementToDTO } from './arcElementToDTO.js';
import { isAnglePath } from '../object-explorer/isAnglePath.js';
import { isNumber } from '../../../isNumber.js';
import { MathCommands } from '../../../command-groups/MathCommands.js';
import { RasterRectangleShape } from '../../../drawing/vector/shapes/RasterRectangleShape.js';
import { shapeStyleToDTO } from './shapeStyleToDTO.js';
import { TextShape } from '../../../drawing/vector/shapes/TextShape.js';
import { Vector3D } from '../../../drawing/vector/Vector3D.js';
const serializableTypes = new Set(['boolean', 'number', 'string']);

function convertKey(key) {
	if (key.toLowerCase().endsWith('radians'))
		return key.substring(0, key.length - 'radians'.length);
	return key;
}

function sanitizeValue(key, value) {
	if (value instanceof Vector3D)
		return value.coords;
	if (key === 'elements' && value instanceof Array) {
		return value.map(function(v) {
			if (v.coords instanceof Array)
				return v.coords;
			else
				return arcElementToDTO(v);
		});
	}
	if (isAnglePath(key) && isNumber(value))
		return value / MathCommands.degToRadianScale;
	else
		return value;
}

export function shapeToDetailsDTO(shape) {
	const styleKeys = new Set();
	if (!(shape instanceof RasterRectangleShape)) {
		styleKeys.add('pen');
		styleKeys.add('material');
	}
	if (shape instanceof TextShape)
		styleKeys.add('font');
	const result = {
	};
	if (styleKeys.size !== 0) {
		result.style = shapeStyleToDTO(shape.style, styleKeys);
	}
	for (const key in shape) {
		const value = shape[key];
		if (key !== 'position' &&
		(serializableTypes.has(typeof value) || value instanceof Vector3D || key === 'elements')) {
			const convertedKey = convertKey(key);
			const sanitizedValue = sanitizeValue(key, value);
			result[convertedKey] = sanitizedValue;
		}
	}
	return result;
};