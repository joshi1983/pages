import { processFixerCases } from './processFixerCases.js';
import { removeUnconditionalIfStatements } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/refactoring/removeUnconditionalIfStatements.js';

export function testRemoveUnconditionalIfStatements(logger) {
	const cases = [
	{'code': '', 'to': ''},
	{'code': `if x then
	print "hi"`, 'changed': false},
	{'code': `if 1 then
	print "hi"`, 'to': 'print "hi"'},
	];
	processFixerCases(cases, removeUnconditionalIfStatements, logger);
};