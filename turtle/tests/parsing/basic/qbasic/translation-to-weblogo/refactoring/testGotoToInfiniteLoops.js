import { gotoToInfiniteLoops } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/refactoring/gotoToInfiniteLoops.js';
import { processFixerCases } from './processFixerCases.js';

export function testGotoToInfiniteLoops(logger) {
	const cases = [
	{'code': '', 'to': ''},
	{'code': `goto 100
	print "hi"
100`, 'changed': false},
	{'code': `100
	print "hi"
goto 100`, 'to': `100 WHILE 1
	print "hi"
WEND`},
	];
	processFixerCases(cases, gotoToInfiniteLoops, logger);
};