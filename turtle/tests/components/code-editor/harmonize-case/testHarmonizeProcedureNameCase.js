import { harmonizeProcedureNameCase } from '../../../../modules/components/code-editor/harmonize-case/harmonizeProcedureNameCase.js';
import { processTestCase } from './processTestCase.js';

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
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTestCase(caseInfo, harmonizeProcedureNameCase, logger);
	});
};