import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translateTurtleGraphicsFunToWebLogo } from
'../../../../modules/parsing/turtle-graphics-fun/translation-to-weblogo/translateTurtleGraphicsFunToWebLogo.js';

export function testTranslateFix(logger) {
	const cases = [
		{'in': 'function p() {}', 'outContains': 'to p\nend \np'},
		{'in': 'function demo() {}', 'outContains': 'to demo\nend \ndemo'},
	];
	testInOutPairs(cases, translateTurtleGraphicsFunToWebLogo, logger);
};