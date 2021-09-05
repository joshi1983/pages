import { processExecuterTestCase } from './processExecuterTestCase.js';

export function testLogoProgramExecuterInvokeUsingPrint(logger) {
	return;
	const cases = [
		{
			'code': `to map :vals :cmd
				localmake "result []
				repeat count :vals [
					localmake "val item repcount :vals
					queue2 "result (invoke :cmd :val)
				]
				output :result
			end
			to mulTwo :val
				output :val * 2
			end
			print map [1 2 5] "mulTwo`,
			'messages': ['[2 4 10]']
		},
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
	cases.forEach(function(caseInfo, index) {
		processExecuterTestCase(caseInfo, index, logger);
	});
};