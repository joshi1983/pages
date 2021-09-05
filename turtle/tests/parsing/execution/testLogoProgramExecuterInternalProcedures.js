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
	];
	processExecuterTestCases(cases, logger);
};