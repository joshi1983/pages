export function canBeBinaryOperator(Operators, s) {
	const info = Operators.getOperatorInfo(s);
	if (info === undefined)
		return false;
	return info.isNotBinary !== true;
};