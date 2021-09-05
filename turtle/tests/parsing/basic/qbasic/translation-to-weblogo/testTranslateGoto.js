import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

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
	{
		'in': '90  GOTO 90', 'out': ''
		// Trivially short infinite loops like this at the end of QBASIC code
		// is intended to keep the program's output visible.  It is like pausing the program.
		// In WebLogo, we don't want to do that.  
		// The trailing trivial infinite loop is best translated to no code in WebLogo.
	},{
		'in': `100 print "hi"
IF inkey$<>"" then goto 100`,
		'out': `do.while [
	print "hi
] true`
	},{
		'in': `100 print "hi"
IF x then goto 100`,
		'out': `do.while [
	print "hi
] :x`
	}
	];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};