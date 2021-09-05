import { IntegerType } from './IntegerType.js';
import { NumberType } from './NumberType.js';

export function numericValuesToDataType(numbers) {
	let isFiniteOnly = true;
	let isUnfiniteOnly = true;
	let isIntegerOnly = true;
	let min = Infinity;
	let max = -Infinity;
	for (let num of numbers) {
		if (!Number.isFinite(num)) {
			isFiniteOnly = false;
			isIntegerOnly = false;
		}
		else
			isUnfiniteOnly = false;
		if (!Number.isInteger(num))
			isIntegerOnly = false;

		max = Math.max(max, num);
		min = Math.min(min, num);
	}
	if (isIntegerOnly) {
		if (max < Number.MAX_SAFE_INTEGER)
			max = Math.ceil(max);
		if (min > -Number.MAX_SAFE_INTEGER)
			min = Math.floor(min);

		return new IntegerType(max, min);
	}
	else
		return new NumberType(isFiniteOnly, isUnfiniteOnly, min, max);
};