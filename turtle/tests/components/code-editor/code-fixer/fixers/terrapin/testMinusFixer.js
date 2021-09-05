import { minusFixer } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/terrapin/minusFixer.js';
import { processTestCases } from '../processTestCases.js';

export function testMinusFixer(logger) {
	const cases = [
		{'code': 'minus', 'logged': false, 'ignoreParseErrors': true},
		{'code': 'minus "hi', 'logged': false, 'ignoreParseErrors': true},
		{'code': 'minus :x', 'to': ' -:x', 'logged': true, 'ignoreParseErrors': true},
		{'code': 'print minus :x', 'to': 'print  -:x', 'logged': true, 'ignoreParseErrors': true},
	];
	processTestCases(cases, minusFixer, logger);
};