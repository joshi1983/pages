import { plusNumberLiteralFixer } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/logo-interpreter/plusNumberLiteralFixer.js';
import { processTestCases } from '../processTestCases.js';

export function testPlusNumberLiteralFixer(logger) {
	const cases = [{
		'code': `print (:x + 1)`,
		'logged': false
	},{
		'code': `print (:x +1)`,
		'to': 'print (:x + 1)',
		'logged': true
	},{
		'code': `print (:x +1)L`,
		'to': 'print (:x + 1)L',
		'logged': true
	},{
		'code': `print (:x +1.2345)`,
		'to': 'print (:x + 1.2345)',
		'logged': true
	},];
	processTestCases(cases, plusNumberLiteralFixer, logger);
};