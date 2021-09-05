import { convertForeachSymbolFixer } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/terrapin/convertForeachSymbolFixer.js';
import { processTestCases } from '../processTestCases.js';

export function testConvertForeachSymbolFixer(logger) {
	const cases = [
	{'code': 'foreach :x [print ?]', 'logged': false},
	{'code': 'foreach :x [print "?]',
	'to': 'foreach :x [print ?]', 'logged': true}
	];
	processTestCases(cases, convertForeachSymbolFixer, logger);
};