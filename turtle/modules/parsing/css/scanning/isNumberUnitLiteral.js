import { isCompleteNumberLiteral } from './isCompleteNumberLiteral.js';

const units = [
'%', 'cm', 'deg', 'em', 'hz', 'Hz', 'in', 'lh',
'mm', 'ms', 'pc', 'pt', 'px', 'rad', 'rem', 'rlh',
's', 'turn', 'vh', 'vmax', 'vmin', 'vw'];

export function isNumberUnitLiteral(s) {
	if (isCompleteNumberLiteral(s))
		return false;
	for (const unit of units) {
		if (s.endsWith(unit)) {
			if (isCompleteNumberLiteral(s.substring(0, s.length - unit.length)))
				return true;
		}
	}
	return false;
};