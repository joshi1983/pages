import { harmonizeKeywordCase } from '../../../../modules/components/code-editor/harmonize-case/harmonizeKeywordCase.js';
import { processTestCases } from './processTestCases.js';

export function testHarmonizeKeywordCase(logger) {
	const cases = [
		{
			'code': 'to p\nend',
			'changed': false
		},
		{
			'code': 'To p\nend',
			'to': 'to p\nend'
		},
		{
			'code': 'TO p\nend',
			'to': 'to p\nend'
		},
		{
			'code': 'TO p\neND',
			'to': 'to p\nend'
		},
	];
	processTestCases(cases, harmonizeKeywordCase, logger);
};