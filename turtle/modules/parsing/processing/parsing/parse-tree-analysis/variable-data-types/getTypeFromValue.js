import { isNumber } from
'../../../../../isNumber.js';

export function getTypeFromValue(value) {
	if (Number.isInteger(value))
		return 'int';
	if (isNumber(value))
		return 'float';
	if (typeof value === 'boolean')
		return 'boolean';
	if (typeof value === 'string')
		return 'String';
	return 'Object';
};