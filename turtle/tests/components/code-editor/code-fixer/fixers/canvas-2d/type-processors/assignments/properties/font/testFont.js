import { testIsFontFamily } from './testIsFontFamily.js';
import { testIsFontSize } from './testIsFontSize.js';
import { testIsFontStyle } from './testIsFontStyle.js';
import { wrapAndCall } from
'../../../../../../../../../helpers/wrapAndCall.js';

export function testFont(logger) {
	wrapAndCall([
		testIsFontFamily,
		testIsFontSize,
		testIsFontStyle
	], logger);
};