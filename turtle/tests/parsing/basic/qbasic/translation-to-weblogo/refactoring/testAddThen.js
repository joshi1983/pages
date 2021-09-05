import { addThen } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/refactoring/addThen.js';
import { processFixerCases } from './processFixerCases.js';

export function testAddThen(logger) {
	const cases = [
	{'code': '', 'to': ''},
	{'code': `if x=3
	print "HI"`,
	'to': `if x=3 THEN
	print "HI"`},
	];
	processFixerCases(cases, addThen, logger);
};