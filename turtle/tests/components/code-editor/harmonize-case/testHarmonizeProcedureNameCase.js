import { harmonizeProcedureNameCase } from '../../../../modules/components/code-editor/harmonize-case/harmonizeProcedureNameCase.js';
import { processTestCases } from './processTestCases.js';

export function testHarmonizeProcedureNameCase(logger) {
	const cases = [
		{
			'code': 'to p\nend',
			'changed': false
		},
		{
			'code': 'to P\nend\nP',
			'changed': false
		},
		{
			'code': 'to P\nend\np',
			'to': 'to p\nend\np'
		},
		{
			'code': 'to p\nend\nP',
			'to': 'to p\nend\np'
		}
	];
	processTestCases(cases, harmonizeProcedureNameCase, logger);
};