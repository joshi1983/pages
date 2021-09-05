import { processTestCases } from
'../../processTestCases.js';
import { simplifyForeverBreak } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/simplifyForeverBreak.js';

export function testSimplifyForeverBreak(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'forever []', 'logged': false},
		{'code': 'while true []', 'logged': false},
		{'code': 'while 1 > random 10 [break]', 'logged': false},
		{'code': 'forever [if random 10 [ break ]]', 'logged': false},
		{'code': 'forever [if random 10 [ break ] break]', 'logged': false},
		{'code': 'forever [break]', 'to': ' ', 'logged': true},
		{'code': 'print "hi forever [break]',
			'to': 'print "hi  ', 'logged': true},
		{'code': 'print "hi forever [break] print "after',
			'to': 'print "hi   print "after', 'logged': true},
		{'code': 'print "hi forever [print "bye break]',
			'to': 'print "hi  print "bye ', 'logged': true},
	];
	processTestCases(cases, simplifyForeverBreak, logger);
};