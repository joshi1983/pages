import { gotoToDoLoopWhile } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/refactoring/gotoToDoLoopWhile.js';
import { processFixerCases } from './processFixerCases.js';

export function testGotoToDoLoopWhile(logger) {
	const cases = [
	{'code': '', 'to': ''},
	{'code': '100 goto 100', 'to': '100 goto 100'
	// no change because the goto is not in an if-statement.
	},{
		'code': '100 IF x=3 THEN goto 100',
		'to': `100 DO
LOOP WHILE x=3`
	},{
		'code': '100 PRINT "hi" IF x=3 THEN goto 100',
		'to': `100 DO
	PRINT "hi"
LOOP WHILE x=3`
	},{
		'code': `100 PRINT "hi" 
IF x THEN 
	goto 100
END IF
IF y THEN 
	goto 100
END IF`,
		'to': `100 DO
DO

	PRINT "hi"

LOOP WHILE x

LOOP WHILE y`
	}
	];
	processFixerCases(cases, gotoToDoLoopWhile, logger);
};