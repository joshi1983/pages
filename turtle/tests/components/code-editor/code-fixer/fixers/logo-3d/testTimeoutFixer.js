import { processTestCases } from '../processTestCases.js';
import { timeoutFixer } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/timeoutFixer.js';

export function testTimeoutFixer(logger) {
	const cases = [
	{'code': 'timeout 250', 'logged': false},
	{'code': '#timeout=250', 'to': '', 'logged': true},
	{'code': '#timeout=', 'to': '', 'logged': true},
	{'code': '#timeout', 'to': '', 'logged': true},
	{'code': '#timeout=\nfd 100', 'to': '\nfd 100', 'logged': true},
	];
	processTestCases(cases, timeoutFixer, logger);
};