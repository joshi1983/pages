import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateCommodoreBasicToWebLogo } from
'../../../../../modules/parsing/basic/commodore-basic/translation-to-weblogo/translateCommodoreBasicToWebLogo.js';

export function testTranslateCircle(logger) {
	const cases = [
		{'in': 'CIRCLE C,X1,Y1,20', 'outContains': 'qbCircleCoordsRadiusColor [ :X1 :Y1 ] 20 :C'}
	];
	testInOutPairs(cases, translateCommodoreBasicToWebLogo, logger);
};
