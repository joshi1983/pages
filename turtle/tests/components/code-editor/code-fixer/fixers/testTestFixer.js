import { processTestCases } from './processTestCases.js';
import { testFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/testFixer.js';

export function testTestFixer(logger) {
	const cases = [
		{'code': 'test 1', 'logged': false},
		{'code': 'iftrue', 'logged': false},
		{'code': 'iftrue []', 'logged': false},
		{'code': 'iffalse []', 'logged': false},
		{'code': 'iftrue [print "hi]', 'logged': false},
		{'code': 'test 1 iftrue [print "hi]',
		'to': 'if 1  [print "hi]', 'logged': true},
		{'code': 'TEST 1 IFTRUE [print "hi]',
		'to': 'if 1  [print "hi]', 'logged': true},
		{'code': 'test 1 ift [print "hi]',
		'to': 'if 1  [print "hi]', 'logged': true},
		{'code': 'test 1 iffalse [print "hi]',
		'to': 'if not 1  [print "hi]', 'logged': true},
		{'code': 'test 1 iff [print "hi]',
		'to': 'if not 1  [print "hi]', 'logged': true},
		{'code': 'test 1 iftrue [print "hi] iffalse [print "yo]',
		'to': 'ifelse 1  [print "hi]  [print "yo]', 'logged': true},
		{'code': 'test 1 ift [print "hi] iff [print "yo]',
		'to': 'ifelse 1  [print "hi]  [print "yo]', 'logged': true},
		{'code': 'TEST 1 IFT [print "hi] IFF [print "yo]',
		'to': 'ifelse 1  [print "hi]  [print "yo]', 'logged': true},
		{'code': 'test 1 iffalse [print "hi] iftrue [print "yo]',
		'to': 'ifelse not 1  [print "hi]  [print "yo]', 'logged': true},
	];
	const options = {
		'testNames': new Set(['test']),
		'iffalseNames': new Set(['iffalse', 'iff']),
		'iftrueNames': new Set(['iftrue', 'ift'])
	};
	processTestCases(cases, testFixer(options), logger);
};