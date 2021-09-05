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
			'inArgs': ['-', ['int(max=5,min=5)']],
			'out': 'int(max=-5,min=-5)'
		},
		{
			'inArgs': ['-', ['int(max=-5,min=-5)']],
			'out': 'int(max=5,min=5)'
		},
		{
			'inArgs': ['-', ['int(max=0,min=0)|int(max=10,min=10)']],
			'out': 'int(max=0,min=0)|int(max=-10,min=-10)'
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
			'inArgs': ['-', ['num(finite,max=0,min=0)']],
			'out': 'num(finite,max=0,min=0)'
		},
		{
			'inArgs': ['-', ['num(finite,max=10,min=0)']],
			'out': 'num(finite,max=0,min=-10)'
		},
		{
			'inArgs': ['-', ['num(finite,max=2,min=1)']],
			'out': 'num(finite,max=-1,min=-2)'
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
			'inArgs': ['+', ['int(min=0)', 'int(min=0)']],
			'out': 'int(min=0)'
		},
		{
			'inArgs': ['+', ['int(min=1)', 'int(min=2)']],
			'out': 'int(min=3)'
		},
		{
			'inArgs': ['+', ['int(min=1)', 'num(min=2)']],
			'out': 'num(min=3)'
		},
		{
			'inArgs': ['+', ['num(min=1)', 'num(min=2)']],
			'out': 'num(min=3)'
		},
		{
			'inArgs': ['+', ['int(max=10,min=1)', 'int(max=20,min=2)']],
			'out': 'int(max=30,min=3)'
		},
		{
			'inArgs': ['+', ['num(finite,max=10,min=1)', 'num(finite,max=20,min=2)']],
			'out': 'num(finite,max=30,min=3)'
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
			'inArgs': ['*', ['int(min=0)', 'int(min=0)']],
			'out': 'int(min=0)'
		},
		{
			'inArgs': ['*', ['int(min=0)', 'int(max=0)']],
			'out': 'int(max=0)' // for example, 2 * -3 = -6(a negative)
		},
		{
			'inArgs': ['*', ['num(min=0)', 'num(max=0)']],
			'out': 'num(max=0)'
		},
		{
			'inArgs': ['*', ['int(max=0)', 'int(max=0)']],
			'out': 'int(min=0)'
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
			'inArgs': ['*', ['num(min=0)', 'num(min=0)']],
			'out': 'num(min=0)'
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
			'inArgs': ['/', ['int(min=0)', 'int(min=0)']],
			'out': 'num(min=0)'
		},
		{
			'inArgs': ['/', ['num(min=0)', 'num(min=0)']],
			'out': 'num(min=0)'
		},
		{
			'inArgs': ['/', ['num(min=0)', 'num(max=0)']],
			'out': 'num(max=0)'
		},
		{
			'inArgs': ['/', ['int(max=0)', 'int(max=0)']],
			'out': 'num(min=0)'
		},
		{
			'inArgs': ['/', ['num(max=0)', 'num(max=0)']],
			'out': 'num(min=0)'
		},
		{
			'inArgs': ['/', ['int', 'num(unfinite)']],
			'out': 'int(max=0,min=0)'
		},
		{
			'inArgs': ['/', ['int', 'num(unfinite,min=0)']],
			'out': 'int(max=0,min=0)'
		},
		{
			'inArgs': ['/', ['int', 'num(finite,max=0,min=0)']],
			'out': 'num(unfinite)'
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
	for (const caseInfo of cases.slice()) {
		const operatorSymbol = caseInfo.inArgs[0];
		/*
		For operators like + and *, swapping the operands should not change the result.
		Add cases with the operands swapped for some extra test coverage.
		*/
		if (['+', '*', '=', '<>'].indexOf(operatorSymbol) !== -1 &&
		caseInfo.inArgs[1][0] !== caseInfo.inArgs[1][1]) {
			cases.push({
				'inArgs': [operatorSymbol, [caseInfo.inArgs[1][1], caseInfo.inArgs[1][0]]],
				'out': caseInfo.out
			});
		}
	}
	testInOutPairs(cases, getReturnDataTypesFromInputs, logger);
};