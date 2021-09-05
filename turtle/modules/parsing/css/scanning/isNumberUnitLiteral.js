import { ArrayUtils } from '../../../ArrayUtils.js';
import { isCompleteNumberLiteral } from './isCompleteNumberLiteral.js';

const lengthUnits = [
'%', 'cm', 'em', 'in', 'mm',
'pc', 'pt', 'px', 'rem',
'vh', 'vmax', 'vmin', 'vw'];

const units = [
'deg', 'hz', 'Hz', 'lh',
'ms', 'rad', 'rlh',
's', 'turn'];
ArrayUtils.pushAll(units, lengthUnits);
export { lengthUnits };

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