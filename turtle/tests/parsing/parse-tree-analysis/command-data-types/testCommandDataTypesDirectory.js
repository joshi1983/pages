import { testIsListType } from './testIsListType.js';
import { testIsMixTransparentType } from './testIsMixTransparentType.js';
import { testIsNonColorList } from './testIsNonColorList.js';
import { testIsNum } from './testIsNum.js';
import { testIsStransparent } from './testIsStransparent.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testCommandDataTypesDirectory(logger) {
	wrapAndCall([
		testIsListType,
		testIsMixTransparentType,
		testIsNonColorList,
		testIsNum,
		testIsStransparent
	], logger);
};