import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testTranslateExecuteIf(logger) {
	const cases = [
	{'code': `Z=1
IF true THEN 350
PRINT "hello"
350 PRINT "AFTER"`,
 'messages': ['AFTER']
 },
	{
		'code': `IF 1 < 2 THEN
	PRINT "HI"`, 'messages': ['HI']
	},{
'code': `IF 1 > 2 THEN
	PRINT "HI"`, 'messages': []
	},{
		'code': 'IF 5-6 THEN PRINT "TRUE"',
		'messages': ['TRUE']
		// page 101 of a book called 
		// BBC Microcomputer System User's Guide
		// says -1 is interpreted as true so that code should print 'TRUE'.
		// https://archive.org/details/bbc-user-guide/page/100/mode/2up?view=theater
	},
	];
	processTranslateExecuteCases(cases, logger);
};