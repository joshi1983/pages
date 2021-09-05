import { cheerfulNetherlandsExamplesAll } from
'../../../../../helpers/parsing/cheerfulNetherlandsLogoExamples.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { translateToWebLogo } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/cheerful-netherlands-logo/translateToWebLogo.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

function testTranslateExamples(logger) {
	cheerfulNetherlandsExamplesAll.forEach(function(content) {
		translateToWebLogo(content);
	});
}

function testWithSpecificExpectedOutputs(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'wacht 1', 'out': ''},
		{'in': 'radCos ( rad :i )', 'outContains': 'radCos cheerfulRad :i'},
		{'in': 'RND 55+10', 'out': 'random 55 + 10'},
		{'in': 'RND (55)+10', 'out': '( random 55 ) + 10'},
		{'in': 'ACHTERGROND 64 64 128', 'out': 'setScreenColor "#404080'},
		{'in': 'ACHTERGROND 64 $x $y', 'out': 'setScreenColor [ 64 :x :y ]'},
		{'in': 'VOORUIT 25', 'outContains': 'forward 25'},
		{'in': 'SCHRIJF "hello world"', 'outContains': `cheerfulLabel 'hello world'`},
		{'in': `HERHAAL 2
			VOORUIT 25
DOE`, 'outContains':
`repeat 2 [
	forward 25
]`}, {
	'in': `leer p
	VOORUIT 25
	eind`,
	'outContains':
`to p
	forward 25
end`
},
{'in': `' Stel kleur en dikte in
		ALS $grootte>5`,
'out': `; Stel kleur en dikte in
if :grootte > 5`},
{'in': `ALS $grootte>5
			PENDIKTE $grootte/8
		ANDERS
			PENDIKTE $grootte
		EINDALS`,
'out': `ifelse :grootte > 5 [
	setPenSize :grootte / 8
] [
	setPenSize :grootte
]`},{
	'in': 'print random(10)*2',
	'out': 'print ( random 10 ) * 2'
},{
	'in': 'zetletter "handschrift" 24',
	'outContains': 'cheerfulSetLetter "handschrift 24'
},{
	'in': 'penkleur rnd 21 1 2',
	'out': 'setPenColor [ random 21 1 2 ]'
}
	];
	testInOutPairs(cases, translateToWebLogo, logger);
}

export function testTranslateToWebLogo(logger) {
	wrapAndCall([
		testTranslateExamples,
		testWithSpecificExpectedOutputs
	], logger);
};