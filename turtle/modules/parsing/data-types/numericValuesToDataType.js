import { IntegerType } from './IntegerType.js';
import { NumberType } from './NumberType.js';

export function numericValuesToDataType(numbers) {
	let isFiniteOnly = true;
	let isUnfiniteOnly = true;
	let isIntegerOnly = true;
	let min = Infinity;
	for (let num of numbers) {
		if (!Number.isFinite(num)) {
			isFiniteOnly = false;
			isIntegerOnly = false;
		}
		else
			isUnfiniteOnly = false;
		if (!Number.isInteger(num))
			isIntegerOnly = false;
		min = Math.min(min, num);
	}
	if (isIntegerOnly)
		return new IntegerType();
	else
		return new NumberType(isFiniteOnly, isUnfiniteOnly, min);
};