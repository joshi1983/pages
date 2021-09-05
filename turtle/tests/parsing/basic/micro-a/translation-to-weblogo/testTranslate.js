import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateMicroABasicToWebLogo } from
'../../../../../modules/parsing/basic/micro-a/translation-to-weblogo/translateMicroABasicToWebLogo.js';

export function testTranslate(logger) {
	const cases = [
		{'in': 'x=3', 'out': 'make "x 3'},
		{'in': 'print rand 5', 'out': 'print random 5'},
		{'in': 'fcolor 0,0,0', 'out': 'setFillColor "#000000'},
		{'in': 'wcolor 0,0,0', 'out': 'setScreenColor "#000000'},
		{'in': 'inputbox hbox,10,350,300,23,"enter number"', 'out': ''},
		{'in': 'setfocus 0', 'out': ''},
		{'in': 'setText hbox, "some new text"', 'out': ''},
		{'in': 'Mode 1', 'out': ''},
		{'in': 'pset 1,2', 'outContains': 'pset1 [ 1 2 ]'},
		{'in': 'label newGame', 'out': ''},
		{'in': 'rect 1,2,3,4', 'outContains': 'qbFilledBox2 [ 1 2 ] [ 3 4 ]'},
		{'in': 'rect x1,y1,x2,y2', 'outContains': 'qbFilledBox2 [ :x1 :y1 ] [ :x2 :y2 ]'},
	];
	testInOutPairs(cases, translateMicroABasicToWebLogo, logger);
};