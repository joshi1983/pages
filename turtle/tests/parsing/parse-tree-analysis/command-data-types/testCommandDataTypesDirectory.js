import { testHasMinValue } from './testHasMinValue.js';
import { testIsFiniteNum } from './testIsFiniteNum.js';
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
		testHasMinValue,
		testIsFiniteNum,
		testIsListType,
		testIsMixTransparentType,
		testIsNonColorList,
		testIsNum,
		testIsStransparent,
		testIsString,
		testIsUnfiniteNum
	], logger);
};