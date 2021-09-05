import { DataTypes } from
'../../data-types/DataTypes.js';
import { hasMaxValue } from './hasMaxValue.js';
import { hasMinValue } from './hasMinValue.js';
import { intersectsWithNum } from './intersectsWithNum.js';
import { isAlphaColor } from './isAlphaColor.js';
import { isFiniteNum } from './isFiniteNum.js';
import { isListOfStrictlyIntOrListOfNumber } from './isListOfStrictlyIntOrListOfNumber.js';
import { isListType } from './isListType.js';
import { isMixTransparentType } from './isMixTransparentType.js';
import { isNum } from './isNum.js';
import { isStransparent } from './isStransparent.js';
import { isStrictlyColorOrNum } from './colorTypes.js';
import { NumberType } from
'../../data-types/NumberType.js';

export function getMixReturnTypes(types1, types2) {
	if ((hasMinValue(types1) && hasMinValue(types2)) ||
	(hasMaxValue(types1) && hasMaxValue(types2))) {
		// use minimum of the 2 minimums.
		let min = Infinity;
		let max = -Infinity;
		let isFiniteOnly = true;
		let isUnfiniteOnly = true;
		for (const typesStr of [types1, types2]) {
			const dTypes = new DataTypes(typesStr);
			for (const t of dTypes.types) {
				if (t.name === 'num') {
					min = Math.min(min, t.min);
					max = Math.max(max, t.max);
					isUnfiniteOnly &= t.isUnfiniteOnly;
					isFiniteOnly &= t.isFiniteOnly;
				}
			}
		}
		return new NumberType(isFiniteOnly, isUnfiniteOnly, min, max).toString();
	}
	else if (isFiniteNum(types1) && isFiniteNum(types2))
		return 'num(finite)';
	else if (isNum(types1) && isNum(types2))
		return 'num';
	else if (isStrictlyColorOrNum(types1) && isStrictlyColorOrNum(types2)) {
		if (intersectsWithNum(types1) && intersectsWithNum(types2))
			return 'colorlist|num';
		return 'colorlist';
	}
	else if (isMixTransparentType(types2) ||
	isAlphaColor(types1) || isAlphaColor(types2)) {
		if (intersectsWithNum(types1) && intersectsWithNum(types2))
			return 'alphacolorlist|num';
		return 'alphacolorlist';
	}
	else if (isListOfStrictlyIntOrListOfNumber(types1) && isListOfStrictlyIntOrListOfNumber(types2))
		return 'list<num>';
	else if (isListType(types1) || isListType(types2)) {
		if (intersectsWithNum(types1) && intersectsWithNum(types2))
			return 'list|num';
		return 'list';
	}
	else if (isStransparent(types1) || isStransparent(types2))
		return 'alphacolorlist';
	else
		return 'list|num';
};