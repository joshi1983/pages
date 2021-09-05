import { arrayLiteralFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/arrayLiteralFixer.js';
import { processTestCases } from './processTestCases.js';

export function testArrayLiteralFixer(logger) {
	const cases = [
	{'code': 'print [1 2]', 'logged': false},
	{'code': 'print {1 2}', 'to': 'print [1 2]', 'logged': true},
	{'code': 'print {1 2 []}', 'to': 'print [1 2 []]', 'logged': true},
	{'code': 'print {1 2 {}}', 'to': 'print [1 2 []]', 'logged': true},
	{'code': 'print {1 2 {a c}}', 'to': 'print [1 2 ["a "c]]', 'logged': true},
	{'code': 'print {}@0', 'to': 'print []', 'logged': true},
	{'code': 'print {}@1', 'to': 'print []', 'logged': true},
	{'code': 'print {}@2', 'to': 'print []', 'logged': true},
	{'code': 'print { \'}\' }@0', 'to': 'print [ \'}\' ]', 'logged': true}
	];
	processTestCases(cases, arrayLiteralFixer, logger);
};