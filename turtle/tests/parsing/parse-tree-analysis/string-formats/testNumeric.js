import { numeric } from
'../../../../modules/parsing/parse-tree-analysis/string-formats/numeric.js';
import { processStringFormatTestCases } from './processStringFormatTestCases.js';

export function testNumeric(logger) {
	const cases = [
	{
		's': '',
		'error': true
	},
	{
		's': '-',
		'error': true
	},
	{
		's': 'a',
		'error': true
	},
	{
		's': 'e',
		'error': true
	},
	{
		's': '1',
		'error': false
	},
	{
		's': '-1',
		'error': false
	},
	{
		's': '123',
		'error': false
	},
	{
		's': '123.456',
		'error': false
	},
	{
		's': '-123.456',
		'error': false
	},
	{
		's': '1.456e5',
		'error': false
	},
	{
		's': '-1.456e5',
		'error': false
	},
	{
		's': '1.456E5',
		'error': false
	},
	{
		's': '1.456E-5',
		'error': false
	},
	{
		's': 'a-123.456',
		'error': true
	},
	{
		's': '-123.456a',
		'error': true
	},
	{
		's': '-1.456e',
		'error': true
	},
	{
		's': '-1.456e3e',
		'error': true
	},
	{
		's': '-123.456=',
		'error': true
	},
	];
	processStringFormatTestCases(cases, logger, numeric);
};