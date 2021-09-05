export function canBeUnaryOperator(Operators, s) {
	const info = Operators.getOperatorInfo(s);
	if (info === undefined)
		return false;
	return info.unary !== undefined;
};