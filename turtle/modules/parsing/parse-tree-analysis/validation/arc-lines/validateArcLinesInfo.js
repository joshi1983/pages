import { isNumber } from '../../../../isNumber.js';

export function validateArcLinesInfo(arcLinesInfo) {
	if (!(arcLinesInfo instanceof Array))
		return 'Arc lines info must be a list.';
	else {
		for (let i = 0; i < arcLinesInfo.length; i++) {
			const e = arcLinesInfo[i];
			if (!(e instanceof Array))
				return `Every element must be a list but found something else at item ${i + 1}.`;
			else if (e.length === 0)
				return `Empty list at item ${i + 1} is not a valid element for arcLines data.`;
			else if (e.length > 2)
				return `No list can be longer than 2 but found a list with count ${e.length} at item ${i + 1}.`;
			else if (!isNumber(e[0]) || (e.length === 2 && !isNumber(e[1])))
				return `Every element in the arcLines data must contain numbers but found something else at item ${i + 1}.`;
			else if (e.length === 2) {
				const lastVal = e[1];
				if (isNumber(lastVal) && lastVal < 0)
					return `The arc radius(${lastVal}) specified at item ${i + 1} is not for arcLines data.  The arc radius must be at least 0.`;
			}
		}
	}
};