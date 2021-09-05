import { isCompleteNumberLiteral } from
'./isCompleteNumberLiteral.js';
import { lengthUnits } from './isNumberUnitLiteral.js';

export function isNumberLengthUnitLiteral(s) {
	for (const unit of lengthUnits) {
		if (s.endsWith(unit)) {
			if (isCompleteNumberLiteral(s.substring(0, s.length - unit.length)))
				return true;
		}
	}
	return false;
};