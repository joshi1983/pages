import { DataTypes } from
'../../data-types/DataTypes.js';
const numTypes = new Set(['int', 'num', 'num(finite)', 'num(unfinite)']);

export function isNum(type) {
	if (numTypes.has(type))
		return true;

	if (typeof type !== 'string' ||
	(!type.startsWith('num(') && !type.startsWith('int(')))
		return false;

	if (type.indexOf('|') !== -1) {
		const types = new DataTypes(type);
		for (const singleType of types.types) {
			const typeName = singleType.name;
			if (typeName !== 'num' && typeName !== 'int')
				return false;
		}
	}

	return true; // For example, num(min=0), num(finite,min=0)...
};