import { isDataTypeContaining } from './isDataTypeContaining.js';

export function isSingleDataTypeContainingTypes(type, types) {
	for (const containedType of types) {
		if (!isDataTypeContaining(type, containedType))
			return false;
	}
	return true;
};