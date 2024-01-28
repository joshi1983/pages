import { containsTypeName } from './containsTypeName.js';
import { getMixParameterSubtypesFromListType } from './getMixParameterSubtypesFromListType.js';
import { intersectsWithNum } from './intersectsWithNum.js';
import { isAlphaColor } from './isAlphaColor.js';
import { isMixTransparentType } from './isMixTransparentType.js';
import { isNonColorList } from './isNonColorList.js';
import { isNum } from './isNum.js';

const commandGetParameterTypes = {
	"mix": function(index, getTypesForParameter) {
		if (index === 2)
			return 'num'; // third parameter is always num.

		const otherIndex = (index + 1) % 2;
		const otherTypes = getTypesForParameter(otherIndex);
		if (index === 0 && isMixTransparentType(otherTypes)) {
			if (containsTypeName(otherTypes, 'num'))
				return 'alphacolor|num';
			return 'alphacolor';
		}
		if (isNum(otherTypes)) {
			if (index === 1)
				return 'alphacolor|num|transparent';
			else
				return 'alphacolor|num';
		}
		// if otherTypes is a number, it can be interpretted 
		// as a color or a number.
		if (!isNum(otherTypes)) {
			if (isNonColorList(otherTypes)) {
				const listSubtypesExpression = getMixParameterSubtypesFromListType(otherTypes, index);
				if (index === 1)
					return `alphacolor|list${listSubtypesExpression}|transparent`;
				return `alphacolor|list${listSubtypesExpression}`;
			}
			if (isAlphaColor(otherTypes)) {
				if (index === 1)
					return 'alphacolor|transparent';
				return 'alphacolor';
			}
		}
		if (index === 1)
			return 'alphacolor|list|num|transparent';
		else
			return 'alphacolor|list|num';
	}
};

export { commandGetParameterTypes };