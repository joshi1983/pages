import { exitWhileToIf } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/refactoring/exitWhileToIf.js';
import { processFixerCases } from './processFixerCases.js';

export function testExitWhileToIf(logger) {
	const cases = [
	{'code': '', 'to': ''},
	{'code': `while x
	print "hi"
	EXIT WHILE
wend`, 'to': `IF x THEN
	print "hi"
END IF`},
	{'code': `DO WHILE i% < 10
    i% = i% + 1
LOOP`, 'changed': false
// There is no EXIT.
},{
	'code': `WHILE i < 10
    i = i + 1
	EXIT WHILE
WEND`,
	'to': `IF i < 10 THEN
	i = i + 1
END IF`
},{
	'code': `WHILE i < 10
    i = i + 1
	EXIT WHILE
	print "hi"
WEND`,
// No need to keep instructions after the exit statement.
	'to': `IF i < 10 THEN
	i = i + 1
END IF`
}
	];
	processFixerCases(cases, exitWhileToIf, logger);
};