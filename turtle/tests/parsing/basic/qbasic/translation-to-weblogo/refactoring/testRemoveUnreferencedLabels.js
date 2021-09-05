import { processFixerCases } from './processFixerCases.js';
import { removeUnreferencedLabels } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/refactoring/removeUnreferencedLabels.js';

export function testRemoveUnreferencedLabels(logger) {
	const cases = [
	{'code': '', 'to': ''},
	{'code': '100', 'to': ''},
	{'code': '100 print "hi"', 'to': 'print "hi"'},
	{'code': '100\n110\n120\n', 'to': ''},
	];
	processFixerCases(cases, removeUnreferencedLabels, logger);
};