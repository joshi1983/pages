import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translateTurtleGraphicsFunToWebLogo } from
'../../../../modules/parsing/turtle-graphics-fun/translation-to-weblogo/translateTurtleGraphicsFunToWebLogo.js';

export function testTranslateFunctionCalls(logger) {
	const cases = [
		{'in': 'circle(100)', 'outContains': 'circle 100'},
		{'in': 'forward(100)', 'outContains': 'forward 100'},
		{'in': 'penup()', 'outContains': 'penUp'},
		{'in': 'penUp()', 'outContains': 'penUp'},
		{'in': 'pu()', 'outContains': 'penUp'}
	];
	testInOutPairs(cases, translateTurtleGraphicsFunToWebLogo, logger);
};