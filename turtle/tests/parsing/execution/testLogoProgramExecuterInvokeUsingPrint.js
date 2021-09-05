import { processExecuterTestCases } from './processExecuterTestCases.js';

export function testLogoProgramExecuterInvokeUsingPrint(logger) {
	const cases = [
		{
			'code': `make "commands ["sum "minus]
repeat count :commands [
	print (invoke (item repcount :commands) 5 3)
]`,
			'messages': ['8', '2']
		},
		{
			'code': `make "result []
				make "vals [2 3]
				repeat count :vals [
					make "val item repcount :vals
					queue2 "result (invoke "sum :val 2)
				]
				print :result`,
				'messages': ['[4 5]']
		}
	];
	processExecuterTestCases(cases, logger);
};