import { harmonizeKeywordCase } from '../../../../modules/components/code-editor/harmonize-case/harmonizeKeywordCase.js';
import { processTestCase } from './processTestCase.js';

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
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTestCase(caseInfo, harmonizeKeywordCase, logger);
	});
};