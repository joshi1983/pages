import { getReturnDataTypesFromInputs } from
'../../../../modules/parsing/parse-tree-analysis/operator-data-types/getReturnDataTypesFromInputs.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testGetReturnDataTypesFromInputs(logger) {
	const cases = [
		{
			'inArgs': ['<', ['int', 'int']],
			'out': 'bool'
		},
		{
			'inArgs': ['<', ['string', 'string']],
			'out': 'bool'
		},
		{
			'inArgs': ['<', ['string', 'string']],
			'out': 'bool'
		},
		{
			'inArgs': ['>', ['string', 'string']],
			'out': 'bool'
		},
		{
			'inArgs': ['>', ['int', 'int']],
			'out': 'bool'
		},
		{
			'inArgs': ['=', ['int', 'int']],
			'out': 'bool'
		},
		{
			'inArgs': ['<>', ['int', 'int']],
			'out': 'bool'
		},
		{
			'inArgs': ['>=', ['int', 'int']],
			'out': 'bool'
		},
		{
			'inArgs': ['<=', ['int', 'int']],
			'out': 'bool'
		},
		{
			'inArgs': ['-', ['int']],
			'out': 'int'
		},
		{
			'inArgs': ['-', ['num']],
			'out': 'num'
		},
		{
			'inArgs': ['-', ['num(finite)']],
			'out': 'num(finite)'
		},
		{
			'inArgs': ['-', ['num(finite,min=0)']],
			'out': 'num(finite)'
		},
		{
			'inArgs': ['-', ['num(unfinite)']],
			'out': 'num(unfinite)'
		},
		{
			'inArgs': ['-', ['num(unfinite,min=infinity)']],
			'out': 'num(unfinite)'
		},
		{
			'inArgs': ['+', ['int', 'int']],
			'out': 'int'
		},
		{
			'inArgs': ['+', ['int', 'num(finite)']],
			'out': 'num(finite)'
		},
		{
			'inArgs': ['+', ['int', 'num(finite,min=0)']],
			'out': 'num(finite)'
		},
		{
			'inArgs': ['+', ['int', 'num(unfinite)']],
			'out': 'num(unfinite)'
		},
		{
			'inArgs': ['+', ['int', 'num']],
			'out': 'num'
		},
		{
			'inArgs': ['+', ['int', 'num(min=0)']],
			'out': 'num'
		},
		{
			'inArgs': ['+', ['num(unfinite)', 'int']],
			'out': 'num(unfinite)'
		},
		{
			'inArgs': ['-', ['int', 'num']],
			'out': 'num'
		},
		{
			'inArgs': ['-', ['int', 'num(finite)']],
			'out': 'num(finite)'
		},
		{
			'inArgs': ['-', ['int', 'num(unfinite)']],
			'out': 'num(unfinite)'
		},
		{
			'inArgs': ['-', ['num(unfinite)', 'int']],
			'out': 'num(unfinite)'
		},
		{
			'inArgs': ['*', ['int', 'int']],
			'out': 'int'
		},
		{
			'inArgs': ['*', ['int', 'num']],
			'out': 'num'
		},
		{
			'inArgs': ['*', ['int', 'num(min=0)']],
			'out': 'num'
		},
		{
			'inArgs': ['*', ['int', 'num(finite)']],
			'out': 'num(finite)'
		},
		{
			'inArgs': ['*', ['int', 'num(unfinite)']],
			'out': 'num(unfinite)'
		},
		{
			'inArgs': ['*', ['list', 'num']],
			'out': 'num'
			// list is not a valid operand type for * so just return
			// the most broad data type, the type that includes all possible valid * return values. 
		},
		{
			'inArgs': ['*', ['list', 'num(min=0)']],
			'out': 'num'
		},
		{
			'inArgs': ['*', ['bool', 'num']],
			'out': 'num' 
			// bool is not a valid operand type for *.
		},
		{
			'inArgs': ['/', ['int', 'int']],
			'out': 'num'
		},
		{
			'inArgs': ['/', ['int', 'num(unfinite)']],
			'out': 'num' // could be 0, indeterminate
		},
		{
			'inArgs': ['/', ['int', 'num(unfinite,min=0)']],
			'out': 'num' // could be 0, indeterminate
		},
		{
			'inArgs': ['/', ['int', 'num(finite)']],
			'out': 'num' // could be Infinity, -Infinity, lots of finite numbers
		},
		{
			'inArgs': ['/', ['int', 'num(finite)']],
			'out': 'num'
		},
		{
			'inArgs': ['/', ['int', 'num(finite,min=0)']],
			'out': 'num'
		},
	];
	testInOutPairs(cases, getReturnDataTypesFromInputs, logger);
};