import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/translate.js';

export function testTranslateGoto(logger) {
	const cases = [
	{'in': `label:
	print "hi"
	goto label`,
	'out': `forever [
	print "hi
]`},{'in': `label:
	print "hi"
	goto labelafter
	goto label
labelafter:`,
	'out': 'print "hi'},
	{'in': `goto label
label:`,
	'out': ''},
	{'in': `goto 100
	print "hi"
100 print "bye"`,
'out': `print "bye`},
	{'in': `if true then goto 100
	print "hi"
100 print "bye"`,
'out': 'print "bye'},
	{'in': `while true
	print "hi"
	goto 100
	wend
100 print "bye"`,
'out': `print "hi
print "bye`},
	];
	testInOutPairs(cases, translate, logger);
};