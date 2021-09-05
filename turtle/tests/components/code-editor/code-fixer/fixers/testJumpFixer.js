import { jumpFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/jumpFixer.js';
import { processTestCases } from './processTestCases.js';

export function testJumpFixer(logger) {
	const cases = [
	{'code': 'jumpForward 100', 'logged': false},
	{'code': 'left 90\njumpForward 100', 'logged': false},
	{'code': 'left 90\njumpForward 100\nleft 90', 'logged': false},
	{'code': 'left 90\njumpForward 100\nleft -90',
	'to': ' \njumpLeft 100\n ',
	'logged': true},
	{'code': 'left 90\njumpForward 100\nright 90',
	'to': ' \njumpLeft 100\n ',
	'logged': true},
	{'code': 'left 90\njumpRight 100\nright 90',
	'to': ' \njumpForward 100\n ',
	'logged': true},
	{'code': 'left 90\njumpLeft 100\nright 90',
	'to': ' \njumpBackward 100\n ',
	'logged': true},
	{'code': 'left -90\njumpRight 100\nright -90',
	'to': ' \njumpBackward 100\n ',
	'logged': true},
	{'code': 'left 90\njumpRight 100\nright 90',
	'to': ' \njumpForward 100\n ',
	'logged': true},
	{'code': 'left 90\njumpLeft 100\nright 90',
	'to': ' \njumpBackward 100\n ',
	'logged': true},
	{'code': 'left 90\njumpForward penSize\nleft -90',
	'to': ' \njumpLeft penSize\n ',
	'logged': true},
	{'code': 'to p\nend\nleft 90\njumpForward 100\nleft -90',
	'to': 'to p\nend\n \njumpLeft 100\n ',
	'logged': true},
	{'code': 'to p\nright 30\noutput 100\nend\nleft 90\njumpForward p\nleft -90',
	'logged': false},
	];
	processTestCases(cases, jumpFixer, logger);
};