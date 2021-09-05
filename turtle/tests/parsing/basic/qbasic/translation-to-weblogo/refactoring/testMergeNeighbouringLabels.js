import { mergeNeighbouringLabels } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/refactoring/mergeNeighbouringLabels.js';
import { processFixerCases } from './processFixerCases.js';

export function testMergeNeighbouringLabels(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': '100', 'changed': false},
		{'code': '100 gosub 100', 'changed': false},
		{'code': '100 goto 100', 'changed': false},
		{'code': '100 print "hi"', 'changed': false},
		{'code': '100 print "hi"\n110', 'changed': false},
		{'code': '100\n110', 'to': '110'},
		{'code': '100\n110 print "hi"', 'to': '110 print "hi"'},
		{'code': '100\n110 goto 100', 'to': '110 goto 110'},
		{'code': '100\n110 gosub 100', 'to': '110 gosub 110'},
		{'code': '100\n110\n120 print "hi"', 'to': '120 print "hi"'},
		{'code': 'goto 100\n100\n110\n120 print "hi"', 'to': 'goto 120\n120 print "hi"'},
	];
	processFixerCases(cases, mergeNeighbouringLabels, logger);
};