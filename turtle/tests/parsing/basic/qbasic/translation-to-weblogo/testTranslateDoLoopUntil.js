import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateDoLoopUntil(logger) {
	const cases = [
	{'in': `n = 1
DO
    PRINT n
    n = n + 1
LOOP UNTIL n > 2`,
	'out': `make "n 1
do.while [
	print :n
	make "n :n + 1
] not :n > 2`},
	{'in': `n = 1
DO
    PRINT n
    n = n + 1
LOOP UNTIL n`,
	'out': `make "n 1
do.while [
	print :n
	make "n :n + 1
] not :n`}
	];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};