import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateDoWhile(logger) {
	const cases = [
	{'in': `n = 1
DO 
    PRINT n
    n = n + 1
LOOP WHILE n <= 2`,
	'out': `make "n 1
do.while [
	print :n
	make "n :n + 1
] :n <= 2`},
	{ // example from: https://qbasic.net/en/qb-manual/Statement/DO...LOOP.htm
	'in': `DO WHILE i% < 10
    i% = i% + 1
LOOP`,
	'out': `while :i < 10 [
	make "i :i + 1
]`},
	{'in': `DO WHILE i < 10
    i = i + 1
	goto 100
LOOP
100`,
	'out': `if :i < 10 [
	make "i :i + 1
]`}
	];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};