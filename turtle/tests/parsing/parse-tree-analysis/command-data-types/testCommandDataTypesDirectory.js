import { testGetSubtypesFromListTypes } from './testGetSubtypesFromListTypes.js';
import { testHasMaxValue } from './testHasMaxValue.js';
import { testHasMinValue } from './testHasMinValue.js';
import { testIntersectsWithNum } from './testIntersectsWithNum.js';
import { testIsFiniteNum } from './testIsFiniteNum.js';
import { testIsInt } from './testIsInt.js';
import { testIsListType } from './testIsListType.js';
import { testIsMixTransparentType } from './testIsMixTransparentType.js';
import { testIsNonColorList } from './testIsNonColorList.js';
import { testIsNum } from './testIsNum.js';
import { testIsStransparent } from './testIsStransparent.js';
import { testIsString } from './testIsString.js';
import { testIsUnfiniteNum } from './testIsUnfiniteNum.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testCommandDataTypesDirectory(logger) {
	wrapAndCall([
		testGetSubtypesFromListTypes,
		testHasMaxValue,
		testHasMinValue,
		testIntersectsWithNum,
		testIsFiniteNum,
		testIsInt,
		testIsListType,
		testIsMixTransparentType,
		testIsNonColorList,
		testIsNum,
		testIsStransparent,
		testIsString,
		testIsUnfiniteNum
	], logger);
};