import { processExecuterTestCases } from './processExecuterTestCases.js';

export function testLogoProgramExecuterInternalProcedures(logger) {
	const cases = [
		{
			'code': `to mulTwo :val
				output :val * 2
			end
			print map "mulTwo [1 2 5]`,
			'messages': ['[2 4 10]']
		},
		{
			'code': 'print (sort2 [1 -2 3] "less? )'
			'messages': ['[-2 1 3]']
		},
	];
	processExecuterTestCases(cases, logger);
};