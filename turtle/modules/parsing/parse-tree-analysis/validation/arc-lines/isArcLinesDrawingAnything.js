import { isNumber } from '../../../../isNumber.js';

export function isArcLinesDrawingAnything(arcs) {
	if (!(arcs instanceof Array))
		return false;
	return arcs.some(function(arcLineElement) {
		if (!(arcLineElement instanceof Array))
			return false; // An invalid element can't draw anything.
		const firstVal = arcLineElement[0];
		if (arcLineElement.length === 1)
			return isNumber(firstVal) && firstVal !== 0;
		if (arcLineElement.length === 2) {
			const lastVal = arcLineElement[1];
			return isNumber(lastVal) && lastVal !== 0;
		}
		return true;
	});
};