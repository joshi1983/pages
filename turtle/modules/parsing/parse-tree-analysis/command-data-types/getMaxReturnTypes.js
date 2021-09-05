import { allInts } from './allInts.js';
import { getMinMaxGenericReturnTypes } from './getMinMaxGenericReturnTypes.js';
import { NumberType } from '../../data-types/NumberType.js';
import { typesStrToSingleDataType } from './typesStrToSingleDataType.js';

export function getMaxReturnTypes() {
	const args = Array.from(arguments);
	if (allInts(args))
		return 'int';

	let min = -Infinity, max = -Infinity, finiteOnly = true, unfiniteOnly = true;
	for (const t of args) {
		const type = typesStrToSingleDataType(t);
		if (type !== undefined && type.name === 'num') {
			finiteOnly &&= type.isFiniteOnly;
			unfiniteOnly &&= type.isUnfiniteOnly;
			min = Math.max(min, type.min);
		}
		else {
			finiteOnly = false;
			unfiniteOnly = false;
		}
		
		if (max !== Infinity) {
			// get the minimum.
			if (type === undefined || type.name !== 'num')
				max = Infinity;
			else
				max = Math.max(max, type.max);
		}
	}
	if (max !== Infinity || min !== -Infinity) {
		return new NumberType(finiteOnly, unfiniteOnly, min, max).toString();
	}
	return getMinMaxGenericReturnTypes(...args);
};