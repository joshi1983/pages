import { processExecuterTestCases } from './processExecuterTestCases.js';

export function testLogoProgramExecuterFor(logger) {
	const cases = [
		{'code': 'for ["x 1 5 1] [print :x]', 'messages': ['1', '2', '3', '4', '5']},
		{'code': 'for ["x 1 5] [print :x]', 'messages': ['1', '2', '3', '4', '5']},
		{'code': 'for ["x 1 -5] [print :x]', 'messages': ['1', '0', '-1', '-2', '-3', '-4', '-5']},
		{
			'code': 'for ["x 5 0] [print :x]',
			'messages': ['5', '4', '3', '2', '1', '0']
		},
		{
			'code': 'for ["x 5 0 -1] [print :x]',
			'messages': ['5', '4', '3', '2', '1', '0']
		},
		{
			'code': 'for ["x 0 5] [print :x]',
			'messages': ['0', '1', '2', '3', '4', '5']
		},
		{
			'code': 'for ["x 0 5 1] [print :x]',
			'messages': ['0', '1', '2', '3', '4', '5']
		},
		{
			'code': 'for ["x 5 5] [print :x]',
			'messages': ['5']
		},
		{
			'code': 'for ["x 5 5 1] [print :x]',
			'messages': ['5']
		},
		{
			'code': 'for ["x 5 5 -1] [print :x]',
			'messages': ['5']
		},
		{'code': 'to f\nfor ["x 1 5 1] [print :x output 1]\nend\nprint f', 'messages': ['1', '1']},
		{'code': 'to f\nfor ["x 1 5 1] [print :x output 0]\nend\nfor ["x 1 5 1] [print :x]', 'messages': ['1', '2', '3', '4', '5']},
		{'code': 'to f\nfor ["x 1 5 1] [print :x output 0]\nend\nfor ["x 1 5 1] [print f]', 'messages': ['1', '0', '1', '0', '1', '0', '1', '0', '1', '0']},
		{'code': 'to f\nfor ["x 1 5 1] [print :x output 0]\nend\nfor ["x 1 5 1] [print :x+f]', 'messages': ['1', '1', '1', '2', '1', '3', '1', '4', '1', '5']},
	];
	processExecuterTestCases(cases, logger);
};