import { processFixerCases } from './processFixerCases.js';
import { replaceDoWhileLoopWithWhileWend } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/refactoring/replaceDoWhileLoopWithWhileWend.js';

export function testReplaceDoWhileLoopWithWhileWend(logger) {
	const cases = [
	{'code': '', 'to': ''},
	{'code': `do while x=3
	print "hi"
loop`, 'to': `WHILE x=3
	print "hi"
WEND`},
	{'code': `do while x=3
	print "hi"
	exit do
loop`, 'to': `WHILE x=3
	print "hi"
	exit WHILE
WEND`
// The EXIT statement needs to get updated because EXIT DO
// does not work inside a while-loop.
},
	{'code': `do while x=3
	print "hi"
	do until y
		exit do
	loop
loop`, 'to': `WHILE x=3
	print "hi"
	do until y
		exit do
	loop
	WEND`},
	{'code': `do while x=3
	print "hi"
	for y=2 to 10
		exit do
	next y
loop`, 'to': `WHILE x=3
	print "hi"
	for y=2 to 10
		exit WHILE
	next y
WEND`
	},
	{'code': `do while x=3
	print "hi"
	do while y
		exit do
	loop
loop`, 'to': `WHILE x=3
	print "hi"
	WHILE y
		exit WHILE
	WEND
WEND`
	}
	];
	processFixerCases(cases, replaceDoWhileLoopWithWhileWend, logger);
};