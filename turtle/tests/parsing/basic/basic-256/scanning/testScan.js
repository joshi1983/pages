import { processScanTestCases } from '../../../processScanTestCases.js';
import { scan } from
'../../../../../modules/parsing/basic/basic-256/scanning/scan.js';

export function testScan(logger) {
	const cases = [
	{
		'code': '',
		'tokens': []
	},
	{
		'code': '# some comment',
		'tokens': ['REM some comment']
	},
	{
		'code': 'fastgraphics',
		'tokens': []
	},
	{
		'code': 'pause 0.1',
		'tokens': ['sleep', '0.1']
	},
	{
		'code': 'while 1 print "hi" end while',
		'tokens': ['while', '1', 'print', '"hi"', 'wend']
	},
	{
		'code': 'subroutine s',
		'tokens': ['sub', 's']
	},
	{
		'code': 'clg',
		'tokens': ['CLS']
	},
	{
		'code': 'clg red',
		'tokens': ['clg', 'red']
	},
	{
		'code': `dim a(2)
print a[0]`,
		'tokens': ['dim', 'a', '(', '2', ')', 'print', 'a', '(', '0', ')']
	},
	{
		'code': `dim a(2)
a[0]=0`,
		'tokens': ['dim', 'a', '(', '2', ')', 'a', '(', '0', ')', '=', '0']
	}
	];
	processScanTestCases(cases, scan, logger);
};