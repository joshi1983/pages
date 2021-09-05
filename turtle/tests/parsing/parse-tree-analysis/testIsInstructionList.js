import { isInstructionList } from '../../../modules/parsing/parse-tree-analysis/isInstructionList.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { processTokenChecks } from './processTokenChecks.js';

export function testIsInstructionList(logger) {
	const cases = [
	{'code': 'p fd 10 repeat 2 [print "hi] if 1 < 6 [ prinT 5] ifelse 3 < 7 [ priNt 11] [ prInt 12]', 'checks': [
		{'val': 'p', 'out': false},
		{'val': 'fd', 'out': false},
		{'val': 'repeat', 'out': false},
		{'val': 1, 'out': false},
		{'val': 2, 'out': false},
		{'val': 5, 'out': false},
		{'val': 6, 'out': false},
		{'val': 'print', 'out': false},
		{'val': 'prinT', 'out': false},
		{
			'type': ParseTreeTokenType.LIST,
			'hasParentVal': 'repeat',
			'out': true
		},
		{
			'type': ParseTreeTokenType.LIST,
			'hasParentVal': 'if',
			'out': true
		},
		{
			'type': ParseTreeTokenType.LIST,
			'hasParentVal': 'ifelse',
			'hasChildVal': 'priNt',
			'out': true
		},
		{
			'type': ParseTreeTokenType.LIST,
			'hasParentVal': 'ifelse',
			'hasChildVal': 'prInt',
			'out': true
		},
	]},
	{
		'code': 'to p\noutput ifelse 1 < 2 [ 4 ] [ 5 ]\nend',
		'checks': [
			{
				'val': 'to',
				'out': false
			},
			{
				'val': 'p',
				'out': false
			},
			{
				'val': 'output',
				'out': false
			},
			{
				'val': 'ifelse',
				'out': false
			},
			{
				'val': 1,
				'out': false
			},
			{
				'val': '<',
				'out': false
			},
			{
				'val': 2,
				'out': false
			},
			{
				'hasChildVal': 4,
				'out': false
			},
			{
				'hasChildVal': 5,
				'out': false
			},
			{
				'hasChildVal': 'output',
				'hasParentVal': 'to',
				'out': true // procedure's instruction list
			}
		]
	}
	];
	processTokenChecks(cases, isInstructionList, logger);
};