import { Operators } from '../Operators.js';

export function isStartOfOperator(s) {
	for (const op of Operators.getAll()) {
		if (op.symbol.startsWith(s))
			return true;
	}
	return false;
};