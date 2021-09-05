import { implicitToExplicitGoto } from
'../../../../../../../modules/parsing/other-languages/basic/qbasic/translation-to-weblogo/refactoring/implicitToExplicitGoto.js';
import { processFixerCases } from './processFixerCases.js';

export function testImplicitToExplicitGoto(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'if :x then goto 10', 'changed': false},	
		{'code': 'if :x then print 10', 'changed': false},	
		{'code': `if :x then
10 print "hi"`, 'changed': false},	
		{'code': 'if :x then 10', 'to': 'if :x then goto 10'},	
	];
	processFixerCases(cases, implicitToExplicitGoto, logger);
};