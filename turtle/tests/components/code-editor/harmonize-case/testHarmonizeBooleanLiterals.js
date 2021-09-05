import { harmonizeBooleanLiterals } from
'../../../../modules/components/code-editor/harmonize-case/harmonizeBooleanLiterals.js';
import { processTestCases } from './processTestCases.js';

export function testHarmonizeBooleanLiterals(logger) {
	const cases = [
		{
			'code': 'print true',
			'changed': false
		},
		{
			'code': 'print false',
			'changed': false
		},
		{
			'code': 'print TRUE',
			'to': 'print true'
		},
		{
			'code': 'print FALSE',
			'to': 'print false'
		}
	];
	processTestCases(cases, harmonizeBooleanLiterals, logger);
};