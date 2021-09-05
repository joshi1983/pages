import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateCommodoreBasicToWebLogo } from
'../../../../../modules/parsing/basic/commodore-basic/translation-to-weblogo/translateCommodoreBasicToWebLogo.js';

export function testTranslateLine(logger) {
	const cases = [
		{'in': 'line 1,2,3,4', 'outContains': 'qbLine2 [ 1 2 ] [ 3 4 ]'},
		{'in': 'line,0,x,mx,my-x', 'outContains': 'qbLine2 [ 0 :x ] [ :mx :my - :x ]'}
	];
	testInOutPairs(cases, translateCommodoreBasicToWebLogo, logger);
};
