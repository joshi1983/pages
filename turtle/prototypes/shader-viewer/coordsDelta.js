import { isNumber } from
'../../modules/isNumber.js';

export function coordsDelta(pos1, pos2) {
	if (pos1 !== undefined && pos2 !== undefined) {
		const result = [];
		for (let i = 0; i < pos1.length; i++) {
			result[i] = pos1[i] - pos2[i];
			if (!isNumber(result[i]))
				throw new Error(`A number is required but found ${result[i]}. That is pos1[${i}] - pos2[${i}]`);
		}
		return result;
	}
};