import { Operators } from '../Operators.js';

export function canBeBinaryOperator(s) {
	const info = Operators.getOperatorInfo(s);
	if (info === undefined)
		return false;
	return info.isNotBinary !== true;
};