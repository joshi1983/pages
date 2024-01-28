import { Operators } from '../Operators.js';

export function canBeUnaryOperator(s) {
	const info = Operators.getOperatorInfo(s);
	if (info === undefined)
		return false;
	return info.unary !== undefined;
};