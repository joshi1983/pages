import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translateTurtleGraphicsFunToWebLogo } from
'../../../../modules/parsing/turtle-graphics-fun/translation-to-weblogo/translateTurtleGraphicsFunToWebLogo.js';

export function testTranslateFunctionCalls(logger) {
	const cases = [
		{'in': 'circle(100)', 'outContains': 'circle 100'},
		{'in': `beginShape();
circle(100);
fillShape();`,
		'outContains': 'circle 100'},
		{'in': 'circle(100, 30)', 'outContains': 'tgfCircle_2 100 30'},
		{'in': 'circle(100, 30, true)', 'outContains': 'tgfCircle_2 100 30'},
		{'in': 'circle(100, 30, false)', 'outContains': 'tgfCircle_2 100 -30'},
		{'in': 'circle(100, 30, directionVariable)', 'outContains': 'tgfCircle_3 100 30 :directionVariable'},
		{'in': 'forward(100)', 'outContains': 'forward 100'},
		{'in': 'penup()\ncircle(100)', 'outContains': 'penUp\ncircle 100'},
		{'in': 'penUp()\ncircle(100)', 'outContains': 'penUp\ncircle 100'},
		{'in': 'pu()\ncircle(100)', 'outContains': 'penUp\ncircle 100'},
		{'in': `beginShape();
circle(100, 30);
fillShape();`,
		'outContains': `drawArcLineShape [ 0 1 [ [ 90 0 ] [ 30 1 ] ] ] 100`},
		{'in': `beginShape();
circle(100, 30);
fillShape("red");`,
		'outContains': `setFillColor "red
drawArcLineShape [ 0 1 [ [ 90 0 ] [ 30 1 ] ] ] 100`},
		{'in': 'fillShape()',
		'outContains': 'polyEnd'},
		{'in': 'fillShape("red")',
		'outContains': 'setFillColor "red\npolyEnd'},
		{'in': 'repeat(3, function() {})', 'outContains': 'repeat 3 [\n]'},
		{'in': 'repeat(3, function() {console.log("hi");})', 'outContains': 'repeat 3 [\n\tprint "hi\n]'},
		{'in': 'function func1() {}\nrepeat(3, func1)', 'outContains': `to func1
end

repeat 3 [
	func1
]`},

	];
	testInOutPairs(cases, translateTurtleGraphicsFunToWebLogo, logger);
};