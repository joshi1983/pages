import { askFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/askFixer.js';
import { processTestCases } from './processTestCases.js';

/*
This is for a command like:
https://fmslogo.sourceforge.io/manual/command-ask.html
*/
export function testAskFixer(logger) {
	const cases = [
		{'code': 'ask', 'logged': false},
		{'code': 'ask [', 'logged': false},
		{'code': 'ask []', 'logged': false},
		{'code': 'ask "hi', 'logged': false},
		{'code': 'ask 3', 'logged': false},
		{'code': 'ask 4 4', 'logged': false},// second arg must be a list.
		{'code': 'ask 3 [', 'to': '  ', 'logged': true},
		{'code': 'ask 4 []',
		'to': '  ', 'logged': true},
		{'code': 'ask 4 [print "hi]',
		'to': '  print "hi', 'logged': true},
		{'code': 'asK 4 [print "hi]',
		// check that ask is compared case-insensitive.
		'to': '  print "hi', 'logged': true},
		{'code': 'ask 4 [print "hi print 4]',
		'to': '  print "hi print 4', 'logged': true},
		{'code': 'to p\nask 4 [print "hi print 4]\nend',
		'to': 'to p\n  print "hi print 4\nend', 'logged': true},
	];
	processTestCases(cases, askFixer, logger);
};