import { Operators } from '../Operators.js';

export function isAssignmentOperator(s) {
	const info = Operators.getOperatorInfo(s);
	if (info === undefined)
		return false;
	return info.isAssignment === true;
};