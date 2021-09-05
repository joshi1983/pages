import { processScanTestCases } from '../../../processScanTestCases.js';
import { scan } from
'../../../../../modules/parsing/other-languages/joss/scanning/scan.js';

export function testScan(logger) {
	const cases = [
		{
			'code': '',
			'tokens': []
		},{
			'code': '10.8',
			'tokens': [
				{'s': '10.8', 'colIndex': 3, 'lineIndex': 0}
			]
		},{
			'code': '11.2 Set p=|p|.',
			'tokens': ['11.2',
			{'s': 'Set', 'lineIndex': 0
			}, 'p', '=', '|', 'p', '|',
			{'s': '.', 'lineIndex': 0}
			]
		},{
			'code': 'Type $.',
			'tokens': ['Type', '$', '.']
		},{
			'code': 'Set x=3.',
			'tokens': ['Set', 'x', '=', '3', '.']
		},{
			'code': 'Let f(x)=2*x.',
			'tokens': ['Let', 'f', '(', 'x', ')', '=', '2', '*', 'x', '.']
		},{
			'code': 'Let f(x)=arg(sqrt(1-x*2),x).',
			'tokens': ['Let', 'f', '(', 'x', ')', '=',
			'arg', '(', 'sqrt', '(', '1', '-', 'x', '*', '2', ')',
			',', 'x', ')', '.']
		},{
			'code': 'Let L(x)=log(x)/log(10).',
			'tokens': ['Let', 'L', '(', 'x', ')', '=',
			'log', '(', 'x', ')', '/', 'log', '(', '10', ')', '.']
		},{
			'code': '"  L(%.0f,%.0f)  ="',
			'tokens': ['"  L(%.0f,%.0f)  ="']
		},
		{
			'code': 'Form 1: "  L(%.0f,%.0f)  ="',
			'tokens': ['Form', '1', ':', '"  L(%.0f,%.0f)  ="']
		},
		{
			'code': '2.2  Do part 12 if p≥q.',
			'tokens': ['2.2', 'Do', 'part', '12', 'if', 'p', '≥', 'q', '.']
		},
		{
			'code': '1-2',
			'tokens': ['1', '-', '2']
		},
		{
			'code': 'type 1-2',
			'tokens': ['type', '1', '-', '2']
		},
		{
			'code': 'x-2',
			'tokens': ['x', '-', '2']
		},
		{
			'code': 'f(x)-2',
			'tokens': [
			{'s': 'f', 'colIndex': 0},
			'(', 'x', ')', '-', '2']
		},
		{
			'code': 'Let f(x)=x+3.',
			'tokens': ['Let', 'f', '(', 'x', ')', '=', 'x', '+', '3', '.']
		},
		{
			'code': 'Set x=3.\nSet y=5',
			'tokens': ['Set', 'x', '=', '3', '.',
			{'s': 'Set',
			'colIndex': 2, 'lineIndex': 1},
			{'s': 'y', 'colIndex': 4, 'lineIndex': 1},
			'=', '5']
		}
	];
	processScanTestCases(cases, scan, logger);
};