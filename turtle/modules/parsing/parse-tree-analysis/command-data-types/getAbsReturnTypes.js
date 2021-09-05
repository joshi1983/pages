import { DataTypes } from
'../../data-types/DataTypes.js';

export function getAbsReturnTypes(parameterTypes) {
	if (typeof parameterTypes !== 'string' ||
	parameterTypes === 'num' ||
	parameterTypes.startsWith('num(min=-'))
		return 'num(min=0)';

	if (parameterTypes === 'int' ||
	parameterTypes === 'num(min=0)' ||
	parameterTypes === 'num(finite,min=0)' ||
	parameterTypes === 'num(unfinite,min=0)')
		return parameterTypes;
	else if (parameterTypes === 'num(finite)')
		return 'num(finite,min=0)';
	else if (parameterTypes.startsWith('num(unfinite'))
		return 'num(unfinite,min=infinity)';
	else if (parameterTypes.indexOf('min=') !== -1) {
		// We tried to make this rare for performance reasons.
		const types = Array.from(new DataTypes(parameterTypes).types).filter(t =>
		t.name === 'int' || t.name === 'num');
		if (types.length === 1 && types[0].name === 'num') {
			const t = types[0];
			t.min = Math.max(0, t.min);
			return t.toString();
		}
	}
	return 'num(min=0)';
};