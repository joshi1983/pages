import { CommodoreInternalFunctions } from
'../../CommodoreInternalFunctions.js';
import { isStrictIdentifier } from
'../../../qbasic/scanning/isStrictIdentifier.js';
import { isNumberLiteralStart } from
'../../../qbasic/scanning/isNumberLiteralStart.js';
import { QBasicOperators } from
'../../../qbasic/QBasicOperators.js';

export function hasNoChildrenValueToken(s) {
	const operatorInfo = QBasicOperators.getOperatorInfo(s);
	if (operatorInfo !== undefined)
		return false;
	if (isNumberLiteralStart(s))
		return true;
	if (!isStrictIdentifier(s))
		return false;
	const info = CommodoreInternalFunctions.getFunctionInfo(s);
	if (info !== undefined) {
		if (info.argCount === undefined) {
			if (info.args !== undefined)
				return info.args.length === 0;
			return false;
		}
		else
			return info.argCount.max === 0;
	}
	return true;
};