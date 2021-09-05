import { goFixer } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/terrapin/goFixer.js';
import { processTestCases } from '../processTestCases.js';

export function testGoFixer(logger) {
	const cases = [
		{'code': 'label "hi', 'logged': false},
		{'code': 'go "hi', 'logged': false},
		{'code': 'to p\nlabel "hi\nend\ngo "hi', 'logged': false},
		// can't process a label that is not in the same instruction list as the go.
		
		{'code': 'label "hello go "hi', 'logged': false},
		// can't process since label and go do not match names.

		{'code': 'label "hi go "hi',
		'to': 'forever [ ] ', 'logged': true},
		{'code': 'label "hi print "yo go "hi',
		'to': 'forever [ print "yo ] ', 'logged': true},
	];
	processTestCases(cases, goFixer, logger);
};