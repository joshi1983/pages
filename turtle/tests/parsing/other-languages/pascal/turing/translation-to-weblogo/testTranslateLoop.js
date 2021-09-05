import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { translateTuringToWebLogo } from
'../../../../../../modules/parsing/other-languages/pascal/turing/translation-to-weblogo/translateTuringToWebLogo.js';

export function testTranslateLoop(logger) {
	const cases = [
		{
			'in': `loop
end loop`, 'out': ''
			// since the infinite loop does nothing other than keep the computer busy,
			// it should be removed.
		},
		{
			'in': `loop
	put "hi"
end loop`, 'out': `forever [
	print "hi
]`
		},
		{
			'in': `x:=0
loop
	put "hi"
	x += 1
	exit when x > 1
end loop`, 'out': `make "x 0
forever [
	print "hi
	make "x :x + 1
	if :x > 1 [
		break
	]
]`
		},
	];
	testInOutPairs(cases, translateTuringToWebLogo, logger);
};