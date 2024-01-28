import { intersectsWithNum } from './intersectsWithNum.js';
import { isAlphaColor } from './isAlphaColor.js';
import { isListOfStrictlyIntOrListOfNumber } from './isListOfStrictlyIntOrListOfNumber.js';
import { isListType } from './isListType.js';
import { isMixTransparentType } from './isMixTransparentType.js';
import { isNum } from './isNum.js';
import { isStransparent } from './isStransparent.js';
import { isStrictlyColorOrNum } from './colorTypes.js';

export function getMixReturnTypes(types1, types2) {
	if (isNum(types1) && isNum(types2))
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