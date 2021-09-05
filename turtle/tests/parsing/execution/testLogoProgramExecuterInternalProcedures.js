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
			// no internal procedure used for sort when no comparison procedure is specified.
			// This is an easy way to check that the compilation
			// is doing that.
			'code': 'print sort [1 -2 3]',
			'messages': ['[-2 1 3]']
		},
		{
			// just another no-proc case.
			'code': 'print sort [3 4 -90]',
			'messages': ['[-90 3 4]']
		},
		{
			'code': 'print (sort [1 -2 3] "less? )',
			'messages': ['[-2 1 3]']
		},
		{
			'code': 'print (sort [1 -2 3 90 -3] "less? )',
			'messages': ['[-3 -2 1 3 90]']
		},
		{
			'code': 'print (sort [1 -2 3] "greater? )',
			'messages': ['[3 1 -2]']
		},
		{
			'code': 'print sorted? [1 -2 3]',
			'messages': ['false']
		},
		{
			'code': 'print filter "even? [1 -2 3]',
			'messages': ['[-2]']
		},
		{
			'code': 'print filter "odd? [1 -2 3]',
			'messages': ['[1 3]']
		},
		{
			'code': 'print indexOfSorted 1 [1 2 3]',
			'messages': ['1']
		},
		{
			'code': 'print indexOfSorted 1 []',
			'messages': ['0']
		},
		{
			'code': `to myNumberCompare :val1 :val2
				output :val1 - :val2
			end
			print (indexOfSorted 1 [1 2 3] "myNumberCompare)`,
			'messages': ['1']
		},
		{
			'code': `to myNumberCompare :val1 :val2
				output :val1 - :val2
			end
			print (indexOfSorted 1 [] "myNumberCompare)`,
			'messages': ['0']
		},
	];
	processExecuterTestCases(cases, logger);
};