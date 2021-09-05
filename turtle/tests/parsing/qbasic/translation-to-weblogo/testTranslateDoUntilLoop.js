import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/translate.js';

// There is testTranslateDoUntil which focuses on cases where the until part is at the end of the loop.
export function testTranslateDoUntilLoop(logger) {
	const cases = [
	// This test case was found at:
	// https://www.programmingbasic.com/qbasic-looping-statements-with-examples#do-loop-looping-statement
	{'in': `count = 0  
DO UNTIL count = 10
  count = count + 1
  PRINT "Count is now " + STR$(count)
LOOP`, 'out': `make "count 0
while not ( :count = 10 ) [
	make "count :count + 1
	print word 'Count is now ' str :count
]`}
	];
	testInOutPairs(cases, translate, logger);
};