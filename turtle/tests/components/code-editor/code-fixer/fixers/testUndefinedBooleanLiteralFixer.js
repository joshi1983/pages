import { processTestCases } from './processTestCases.js';
import { undefinedBooleanLiteralFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/undefinedBooleanLiteralFixer.js';

export function testUndefinedBooleanLiteralFixer(logger) {
	const cases = [
	{'code': 'print false', 'logged': false},
	{'code': 'print true', 'logged': false},
	{'code': 'print :false', 'to': 'print false', 'logged': true},
	{'code': 'print :true', 'to': 'print true', 'logged': true},
	{'code': 'make "true 1\nprint :true', 'logged': false},
	{'code': 'make "true 1\nprint :false', 'to': 'make "true 1\nprint false', 'logged': true},
	{'code': 'to p :false\nprint :false\nend', 'logged': false},
	{'code': 'to p :true\nprint :true\nend', 'logged': false},
	{'code': 'to p\nlocalmake "true 1\nprint :false\nend',
		'to': 'to p\nlocalmake "true 1\nprint false\nend', 'logged': true},
	{'code': 'make "false 0\nprint :false', 'logged': false},
	{'code': 'make "false 0\nprint :true', 'to': 'make "false 0\nprint true', 'logged': true},
	{'code': 'to p\nlocalmake "false 0\nprint :true\nend', 'to': 'to p\nlocalmake "false 0\nprint true\nend', 'logged': true},
	];
	processTestCases(cases, undefinedBooleanLiteralFixer, logger);
};