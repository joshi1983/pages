import { DataTypes } from
'../../data-types/DataTypes.js';
import { hasMaxValue } from
'./hasMaxValue.js';
import { hasMinValue } from
'./hasMinValue.js';

const returnSameTypes = new Set([
	'int', 'int(min=0)', 'num(min=0)', 'num(finite,min=0)',
	'num(unfinite,min=0)'
]);

export function getAbsReturnTypes(parameterTypes) {
	if (typeof parameterTypes !== 'string' ||
	parameterTypes === 'num' ||
	parameterTypes.startsWith('num(min=-'))
		return 'num(min=0)';

	if (returnSameTypes.has(parameterTypes))
		return parameterTypes;
	else if (parameterTypes === 'num(finite)')
		return 'num(finite,min=0)';
	else if (parameterTypes.startsWith('num(unfinite'))
		return 'num(unfinite,min=infinity)';
	else if (hasMinValue(parameterTypes) || hasMaxValue(parameterTypes)) {
		// We tried to make this rare for performance reasons.
		const types = Array.from(new DataTypes(parameterTypes).types).filter(t =>
		t.name === 'int' || t.name === 'num');
		if (types.length === 1) {
			const type = types[0];
			if (type.name === 'int' || type.name === 'num') {
				if (type.min >= 0)
					return type.toString();
				if (type.max < 0) {
					const max = type.max;
					type.max = -type.min;
					type.min = -max;
				}
				else if (type.min < 0) {
					type.max = Math.max(type.max, -type.min);
				}
				type.min = Math.max(0, type.min);
				return type.toString();
			}
		}
	}
	return 'num(min=0)';
};