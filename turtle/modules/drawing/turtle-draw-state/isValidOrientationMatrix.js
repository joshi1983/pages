import { isNumber } from '../../isNumber.js';

export function isValidOrientationMatrix(m) {
	if (!(m instanceof Array) || m.length !== 3)
		return false;
	for (let i = 0; i < 3; i++) {
		const row = m[i];
		if (!(row instanceof Array) || row.length !== 3)
			return false;
		for (let j = 0; j < 3; j++) {
			const val = row[j];
			if (!isNumber(val))
				return false;
		}
	}
	return true;
};