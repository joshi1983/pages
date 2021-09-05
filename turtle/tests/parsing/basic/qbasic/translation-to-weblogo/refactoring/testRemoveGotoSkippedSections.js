import { processFixerCases } from './processFixerCases.js';
import { removeGotoSkippedSections } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/refactoring/removeGotoSkippedSections.js';

export function testRemoveGotoSkippedSections(logger) {
	const cases = [
	{'code': '', 'to': ''},
	{'code': `goto 100
	print "hi"
100`, 'to': '100'},
	];
	processFixerCases(cases, removeGotoSkippedSections, logger);
};