import { allInts } from './allInts.js';
import { getMinMaxGenericReturnTypes } from './getMinMaxGenericReturnTypes.js';
import { NumberType } from '../../data-types/NumberType.js';
import { typesStrToSingleDataType } from './typesStrToSingleDataType.js';

export function getMinReturnTypes() {
	const args = Array.from(arguments);
	if (allInts(args))
		return 'int';

	let min = Infinity, max = Infinity, finiteOnly = true, unfiniteOnly = true;
	for (const t of args) {
		const type = typesStrToSingleDataType(t);
		if (type !== undefined && type.num === 'num') {
			finiteOnly &&= type.isFiniteOnly;
			unfiniteOnly &&= type.isUnfiniteOnly;
			max = Math.min(max, type.max);
		}
		else {
			finiteOnly = false;
			unfiniteOnly = false;
		}
		
		if (min !== -Infinity) {
			// get the minimum.
			if (type === undefined || type.name !== 'num')
				min = -Infinity;
			else {
				min = Math.min(min, type.min);
			}
		}
	}
	if (max !== Infinity || min !== -Infinity) {
		return new NumberType(finiteOnly, unfiniteOnly, min, max).toString();
	}
	return getMinMaxGenericReturnTypes(...args);
};