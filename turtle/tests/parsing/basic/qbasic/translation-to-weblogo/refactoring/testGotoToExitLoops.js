import { gotoToExitLoops } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/refactoring/gotoToExitLoops.js';
import { processFixerCases } from './processFixerCases.js';

export function testGotoToExitLoops(logger) {
	const cases = [
	{'code': '', 'to': ''},
	{'code': `goto 100
	print "hi"
100`, 'changed': false},
	{'code': `while 1
	goto 100
wend
print "hi"
100`, 'changed': false
// using EXIT WHILE would not skip over the print "hi" so it would mean something different.
// For that reason, we won't translate this at all.
}, 	{'code': `while 1
	goto 100
wend
print "hi"
while x
	print "another loop"
wend
100`, 'changed': false
// The 100 label is not immediately after the loop containing the goto statement.
// Converting the goto 100 to EXIT WHILE would change the meaning of the code.
// Since it would change the meaning, we don't want the gotoToExitLoops to make any change.
}, {
	'code': `while 1
	print "hi"
	goto 100
wend
100`, 'to': `while 1
	print "hi"
	EXIT WHILE
wend
100`
}, {
	'code': `do while 1
	print "hi"
	goto 100
loop
100`, 'to': `do while 1
	print "hi"
	EXIT DO
loop
100`
}, {
	'code': `do
	print "hi"
	goto 100
loop while 1
100`, 'to': `do
	print "hi"
	EXIT DO
loop while 1
100`
}, {
	'code': `do until 1
	print "hi"
	goto 100
loop
100`, 'to': `do until 1
	print "hi"
	EXIT DO
loop
100`
}, {
	'code': `for x=1 to 10
	print "hi"
	goto 100
next x
100`, 'to': `for x=1 to 10
	print "hi"
	EXIT FOR
next x
100`
}
	];
	processFixerCases(cases, gotoToExitLoops, logger);
};