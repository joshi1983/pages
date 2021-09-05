export function isAssignmentOperator(Operators, s) {
	const info = Operators.getOperatorInfo(s);
	if (info === undefined)
		return false;
	return info.isAssignment === true;
};