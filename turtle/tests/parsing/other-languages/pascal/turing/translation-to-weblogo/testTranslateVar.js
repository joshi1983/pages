import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { translateTuringToWebLogo } from
'../../../../../../modules/parsing/other-languages/pascal/turing/translation-to-weblogo/translateTuringToWebLogo.js';

export function testTranslateVar(logger) {
	const cases = [
		{
			'in': `var x: array 1..2 of real
put x`,
			'out': `make "x [ ]
print :x`
		},
		{
			'in': `var y: array 1..2 of int
put y`,
			'out': `make "y [ ]
print :y`
		},
		{
			'in': `var x,y: array 1..2 of int
put x
put y`,
			'out': `make "x [ ]
make "y [ ]
print :x
print :y`
		},
		{
			'in': `var x: string(5)`,
			'out': ''
		},
		{
			'in': `var x: string(5)
put x`,
			'out': `make "x "
print :x`
		},
		{
			'in': `var x: int
put x`,
			'out': `make "x 0
print :x`
		},
		{
			'in': `var x: char
put x`,
			'out': `make "x ' '
print :x`
		}
	];
	testInOutPairs(cases, translateTuringToWebLogo, logger);
};