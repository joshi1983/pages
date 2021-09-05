import { isFirstLevelInstruction } from '../../../modules/parsing/parse-tree-analysis/isFirstLevelInstruction.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { processTokenChecks } from './processTokenChecks.js';

export function testIsFirstLevelInstruction(logger) {
	const cases = [
	{'code': 'print 4\np\nto procedure1 :param1\nprinT "hi\nend\n', 'checks': [
		{
			'val': 'print',
			'out': true
		},
		{
			'val': 'prinT',
			'out': true
		},
		{
			'val': 'p',
			'out': true
		},
		{
			'val': 4,
			'out': false
		},
		{
			'val': 'procedure1',
			'out': false
		},
		{
			'val': 'param1',
			'out': false
		},
		{
			'type': ParseTreeTokenType.PROCEDURE_END_KEYWORD,
			'out': false
		},
		{
			'type': ParseTreeTokenType.PROCEDURE_START_KEYWORD,
			'out': false
		},
		{
			'type': ParseTreeTokenType.TREE_ROOT,
			'out': false
		},
	]},
	{'code': 'ifelse 1 < 2 [print "hi] [prinT "yo]', 'checks': [
		{
			'val': 'ifelse',
			'out': true
		},
		{
			'val': 'print',
			'out': false
		},
		{
			'val': 'prinT',
			'out': false
		},
		{
			'val': 1,
			'out': false
		},
		{
			'val': 2,
			'out': false
		},
		{
			'val': '<',
			'out': false
		},
		{
			'val': 'hi',
			'out': false
		},
		{
			'val': 'yo',
			'out': false
		}
	]}
	];
	processTokenChecks(cases, isFirstLevelInstruction, logger);
};