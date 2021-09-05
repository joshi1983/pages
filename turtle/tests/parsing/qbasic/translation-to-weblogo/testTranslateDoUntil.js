import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/translate.js';

export function testTranslateDoUntil(logger) {
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
] not :n > 2`}
	];
	testInOutPairs(cases, translate, logger);
};