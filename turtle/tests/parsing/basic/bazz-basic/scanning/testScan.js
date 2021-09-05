import { processScanTestCases } from '../../../processScanTestCases.js';
import { scan } from
'../../../../../modules/parsing/basic/bazz-basic/scanning/scan.js';

export function testScan(logger) {
	const cases = [
	{
		'code': '',
		'tokens': []
	},
	{
		'code': '[inits]',
		'tokens': []
	},
	{
		'code': '[intro]',
		'tokens': []
	},
	{
		'code': '[quit]',
		'tokens': ['quit', ':']
	},
	{
		'code': '[main]',
		'tokens': ['SUB', 'main', '(', ')', 'end', 'sub', 'main', '(', ')']
	},
	{
		'code': '[sub:s]',
		'tokens': ['SUB', 's', '(', ')', 'end', 'sub']
	},
	{
		'code': 'gosub [bla]',
		'tokens': ['gosub', 'bla']
	},
	{
		'code': 'goto [bla]',
		'tokens': ['goto', 'bla']
	},
	{
		'code': 'gosub [main]',
		'tokens': ['gosub', 'main']
	},
	{
		'code': 'gosub [inits]', // weird case but this is how it should be handled anyway.
		'tokens': ['gosub', 'inits']
	},
	{
		'code': 'gosub [sub:bla]',
		'tokens': ['gosub', 'bla']
	},
	];
	processScanTestCases(cases, scan, logger);
};