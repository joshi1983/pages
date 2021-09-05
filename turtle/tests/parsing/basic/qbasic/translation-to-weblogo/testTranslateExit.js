import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateExit(logger) {
	const cases = [
	{'in': 'exit',
'out': ''},
	{'in': `for x=1 to 3
	exit for
next x`,
'out': `repeat 3 [
	break
]`},
	{'in': `while (1)
	if (x) then
		exit while
	end if
wend`,
'out': `forever [
	if :x [
		break
	]
]`},
	];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};